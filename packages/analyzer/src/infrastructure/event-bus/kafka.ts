import {
  type IEventBus,
  type IEvent,
  type IEventHandler,
  type EventDescriptor,
  rehydrateEventFromDescriptor,
} from "@ai-ctx/core";
import { TYPES } from "@src/types";
import { injectable, multiInject, inject } from "inversify";
import type { Consumer, Producer } from "kafkajs";
import { instanceToPlain } from "class-transformer";

@injectable()
export class KafkaEventBus implements IEventBus {
  constructor(
    @multiInject(TYPES.Event)
    private readonly eventHandlers: IEventHandler<IEvent>[],
    @inject(TYPES.KafkaConsumer) private readonly _subscriber: Consumer,
    @inject(TYPES.KafkaProducer) private readonly _producer: Producer
  ) {}
  async publish(chan: string, event: EventDescriptor): Promise<void> {
    const payload: string = JSON.stringify({ ...instanceToPlain(event) });

    await this._producer.send({
      topic: chan,
      messages: [{ value: payload, key: event.aggregateGuid }],
    });
  }
  async subscribeEvents(): Promise<void> {
    await this._subscriber.run({
      eachMessage: async ({ message, heartbeat }) => {
        if (message.value) {
          const eventDescriptor = JSON.parse(message.value.toString());
          const matchedHandlers: IEventHandler<IEvent>[] =
            this.eventHandlers.filter((handler) => {
              return handler.event === eventDescriptor.type;
            });

          // const eventDescriptor = JSON.parse(message.value.toString());
          // console.log("Received event:", eventDescriptor);
          // console.log("Event type:", eventDescriptor.type);
          // console.log(
          //   "Available handlers:",
          //   this.eventHandlers.map((h) => h.event)
          // );

          // const matchedHandlers: IEventHandler<IEvent>[] =
          //   this.eventHandlers.filter((handler) => {
          //     console.log(
          //       `Comparing handler.event: ${handler.event} with event type: ${eventDescriptor.type}`
          //     );
          //     return handler.event === eventDescriptor.type;
          //   });

          // console.log(`Found ${matchedHandlers.length} matching handlers`);

          await Promise.all(
            matchedHandlers.map((handler: IEventHandler<IEvent>) => {
              handler.handle(rehydrateEventFromDescriptor(eventDescriptor));
            })
          );
          await heartbeat();
        }
      },
    });
  }
}
