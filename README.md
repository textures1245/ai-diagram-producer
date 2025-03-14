## LLM Diagram Producer (Experimental)

This project was created as an experimental initiative to explore microservice system architecture design.

### Philosophy of Software Architecture

Understanding why architects make certain decisions and why disagreements arise in software design. Through this deep dive, I've explored `Domain-Driven Design (DDD)` along with complementary workshop tools like `Event Storming` and `User Story mapping`. These techniques helped prove core DDD concepts, particularly `Event-Driven Architecture`.

### Leveraging Open-Source LLMs for Business Value

As large language models become increasingly accessible through open-source initiatives like `Ollama` and the emergence of companies like `DeepSeek` making LLMs more accessible to small businesses, I wanted to understand how smaller organizations can develop their own AI agents with fewer resources. This project demonstrates how companies can create value with these technologies.

### Exploring Alternative Presentation Layers

To expand my skills, I challenged myself with presentation approaches I hadn't tried before. Creating different types of application interfaces proved challenging but rewarding, helping me understand the full stack from user experience to backend architecture.

--

# Abstract

Turn your ideas into beautiful diagrams through simple conversations! LLM Diagram Producer leverages the power of Large Language Models to understand your descriptions and automatically generate professional diagrams.

Whether you need system architecture diagrams, flowcharts, ERDs, or sequence diagrams, simply describe what you want in natural language, and watch as AI turns your words into professional diagrams.

## How It Works

1. **Chat with the AI** - Describe the diagram you want in plain English
2. **Real-time Analysis** - Our analyzer processes your description to understand entities and relationships
3. **Instant Visualization** - See your diagram take shape as you continue the conversation


## Architecture

I've built LLM Diagram Producer with a clean, modular architecture:

### Core Components

- **Presenter Layer**

  - Frontend: Responsive SPA for interacting with the system
  - Backend: API server handling authentication, workspace management, and chat coordination

- **Analyzer Layer**
  - NLP Engine: Processes chat content to extract diagram elements
  - DiagramML Generator: Converts analyzed content into standardized diagram markup
  - Renderer: Transforms DiagramML into visual representations

### Technical Implementation

Event-driven architecture and have implemented CQRS (Command Query Responsibility Segregation) with Event Sourcing:

- **Commands** like `CreateChatCommand` or `UpdateChatCommand` represent user intentions
- **Events** like `ChatCreated` or `WorkspaceCreated` represent state changes
- **Queries** retrieve information without modifying state
- **Projections** provide optimized read models from the event store

This approach gives us incredible flexibility, audit capabilities, and scalability as the system grows.

## Getting Started

### Prerequisites

You'll need the following installed:

- Bun (v1.2+)
- TypeScript (v5.7+)
- Docker and Docker Compose (for local development)

### Manual Setup

1. Clone the repository

```bash
git clone https://github.com/textures1245/llm-diagram-producer.git
cd llm-diagram-producer
```

2. Set up infrastructure

```bash
docker-compose -f docker-compose.infra.yml up -d
```

- Configure environment variables

```bash
cp .env.example .env
#
# Edit .env with your configuration
```

- Install dependencies and start services

```bash
# Install shared dependencies
bun install

# Start analyzer service
cd packages/analyzer
bun install
bun run dev

# Start backend service
cd ../presenter/backend
bun install
bun run dev

# Start frontend service
cd ../frontend
bun install
bun run dev
```

### Development

Project Structure

```bash
llm-diagram-producer/
├── packages/
│   ├── presenter/
│   │   ├── backend/      # API server, auth, workspace management
│   │   └── frontend/     # React-based user interface
│   └── analyzer/         # NLP processing and diagram generation
├── scripts/              # Development and deployment scripts
├── docs/                 # Documentation
└── docker-compose.yml    # Container configuration
```

## Acknowledgments

This experimental project was huge inspiration from [typescript-event-sourcing-sample-app](https://github.com/yerinadler/typescript-event-sourcing-sample-app) from [yerinadler](https://github.com/yerinadler) which served as the foundation for much of my software architecture.
