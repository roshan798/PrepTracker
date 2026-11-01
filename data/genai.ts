import type { Problem, Roadmap, Topic } from '../lib/types';

interface CurriculumSection {
  id: string;
  name: string;
  tasks: string[];
}

interface CurriculumModule {
  id: string;
  name: string;
  duration: string;
  description: string;
  sections: CurriculumSection[];
}

function createModuleTopic(module: CurriculumModule): Topic {
  return {
    id: module.id,
    name: module.name,
    description: `${module.description} Course time: ${module.duration}.`,
    status: 'not-started',
    notes: '',
    subtopics: module.sections.map(section => ({
      id: `${module.id}-${section.id}`,
      name: section.name,
      status: 'not-started',
      notes: '',
      problems: section.tasks.map((name, index): Problem => ({
        id: `${module.id}-${section.id}-${index + 1}`,
        name,
        difficulty: 'medium',
        status: 'not-started',
        notes: '',
      })),
    })),
  };
}

const curriculum: CurriculumModule[] = [
  {
    id: 'genai-m01',
    name: 'Module 01: Generative AI and LLM foundations',
    duration: '55 min',
    description: 'Build a practical mental model of generative systems, language models, and inference.',
    sections: [
      {
        id: 'mental-models',
        name: 'Generative AI and model capabilities',
        tasks: [
          'Explain what generative AI produces and how it differs from discriminative prediction.',
          'Describe next-token prediction as a useful high-level model of an LLM.',
          'Compare model families by capability, latency, context size, and cost.',
        ],
      },
      {
        id: 'tokens-context',
        name: 'Tokens, context, and inference',
        tasks: [
          'Estimate how tokenization affects prompt size, cost, and response length.',
          'Explain context windows, truncation, and what happens when a conversation outgrows its context.',
          'Trace an inference request from input messages through generated output.',
        ],
      },
    ],
  },
  {
    id: 'genai-m02',
    name: 'Module 02: Prompt engineering',
    duration: '40 min',
    description: 'Write clear, testable prompts and choose prompting strategies for different tasks.',
    sections: [
      {
        id: 'prompt-patterns',
        name: 'Zero-shot, few-shot, and reasoning prompts',
        tasks: [
          'Write a zero-shot prompt with a clear role, task, constraints, and output format.',
          'Add representative few-shot examples and check that they cover important edge cases.',
          'Use a stepwise reasoning instruction while requesting a concise, user-facing answer.',
        ],
      },
      {
        id: 'prompt-quality',
        name: 'Prompt quality and iteration',
        tasks: [
          'Separate instructions, trusted context, and untrusted user input in a prompt template.',
          'Build a small evaluation set and compare prompt versions against the same examples.',
          'Document failure cases and revise the prompt without relying on one lucky response.',
        ],
      },
    ],
  },
  {
    id: 'genai-m03',
    name: 'Module 03: Calling LLMs from JavaScript',
    duration: '2 hr 43 min',
    description: 'Integrate a model provider, structure requests, validate responses, and safely run tools.',
    sections: [
      {
        id: 'integration',
        name: 'Provider integration and message structure',
        tasks: [
          'Create a JavaScript or TypeScript model client behind a server-side boundary.',
          'Load API credentials from environment variables rather than browser code or source control.',
          'Construct system, user, assistant, and tool messages in the correct order.',
        ],
      },
      {
        id: 'model-settings',
        name: 'Model settings and response behavior',
        tasks: [
          'Compare temperature, top-p, output limits, and stop conditions for a chosen task.',
          'Handle provider errors, timeouts, rate limits, and empty responses explicitly.',
        ],
      },
      {
        id: 'structured-output',
        name: 'Structured output and validation',
        tasks: [
          'Request JSON or schema-constrained output for a concrete application feature.',
          'Parse and validate model output before allowing application code to use it.',
          'Define a useful recovery path for malformed or incomplete structured output.',
        ],
      },
      {
        id: 'tool-calling',
        name: 'Tool calling fundamentals',
        tasks: [
          'Describe a tool with a narrow name, purpose, and validated argument schema.',
          'Dispatch a model-requested tool only after validating its name and arguments.',
          'Return a bounded tool result to the model and handle tool failures safely.',
        ],
      },
    ],
  },
  {
    id: 'genai-m04',
    name: 'Module 04: Build a chat assistant',
    duration: '2 hr 12 min',
    description: 'Build a complete chat experience with a server boundary, conversation history, and safeguards.',
    sections: [
      {
        id: 'chat-foundation',
        name: 'Chat interface and server flow',
        tasks: [
          'Build a conversation UI with message history, loading state, and an accessible input.',
          'Send model requests through a server endpoint and keep provider secrets off the client.',
          'Show actionable error and retry states without losing the user’s draft.',
        ],
      },
      {
        id: 'conversation-design',
        name: 'Prompting and conversation memory',
        tasks: [
          'Improve the assistant prompt with examples tailored to the chatbot’s task.',
          'Persist conversation turns and reconstruct the message sequence for each request.',
          'Control long histories with a context budget and an explicit summarization strategy.',
        ],
      },
      {
        id: 'reliability',
        name: 'Reliability and loop safeguards',
        tasks: [
          'Set request timeouts, message limits, and bounded retry behavior.',
          'Prevent repeated tool or assistant turns from creating an unbounded request loop.',
          'Test empty input, provider failure, long histories, and rapid repeated submissions.',
        ],
      },
    ],
  },
  {
    id: 'genai-m05',
    name: 'Module 05: RAG foundations',
    duration: '56 min',
    description: 'Understand how retrieval, embeddings, and vector search ground model answers in your data.',
    sections: [
      {
        id: 'rag-concepts',
        name: 'Retrieval-augmented generation',
        tasks: [
          'Draw the RAG flow from a user question through retrieval and grounded answer generation.',
          'Explain why retrieval can reduce unsupported answers but cannot guarantee correctness.',
        ],
      },
      {
        id: 'embeddings',
        name: 'Embeddings and vector stores',
        tasks: [
          'Explain how embeddings represent semantic similarity and where they can fail.',
          'Compare vector search with keyword search and identify when hybrid retrieval helps.',
          'Choose metadata and access boundaries that a vector index must preserve.',
        ],
      },
    ],
  },
  {
    id: 'genai-m06',
    name: 'Module 06: Build a document Q&A system with RAG',
    duration: '2 hr 3 min',
    description: 'Create a document ingestion and retrieval pipeline, then evaluate its answers against source material.',
    sections: [
      {
        id: 'document-ingestion',
        name: 'Document loading and preparation',
        tasks: [
          'Load supported documents and normalize their text and metadata.',
          'Define a policy for unsupported files, empty documents, and malformed content.',
        ],
      },
      {
        id: 'chunking',
        name: 'Chunking strategy',
        tasks: [
          'Compare fixed-size and structure-aware chunks for a representative document.',
          'Tune chunk size and overlap while preserving useful source metadata.',
          'Inspect chunk boundaries for lost headings, split tables, and duplicated text.',
        ],
      },
      {
        id: 'indexing',
        name: 'Embeddings and vector indexing',
        tasks: [
          'Generate embeddings in batches and handle provider limits or failed records.',
          'Index chunks with document IDs, access metadata, and source references.',
          'Make indexing repeatable so updates do not silently duplicate stale chunks.',
        ],
      },
      {
        id: 'retrieval-evaluation',
        name: 'Retrieval, answers, and evaluation',
        tasks: [
          'Retrieve and rank relevant chunks for a question using a chosen top-k strategy.',
          'Ask the model to answer from retrieved context and expose supporting sources.',
          'Test answer quality, retrieval misses, irrelevant context, and abstention behavior.',
        ],
      },
    ],
  },
  {
    id: 'genai-m07',
    name: 'Module 07: Agentic AI concepts',
    duration: '19 min',
    description: 'Recognize when a tool-using workflow is useful and when a regular model call is simpler.',
    sections: [
      {
        id: 'agent-basics',
        name: 'Agents versus chatbots and workflows',
        tasks: [
          'Distinguish a single prompt-response call, a deterministic workflow, and an agent loop.',
          'Identify tasks that benefit from tool selection, iterative execution, or external state.',
          'Name cases where added autonomy would increase cost or risk without improving results.',
        ],
      },
      {
        id: 'agent-boundaries',
        name: 'Autonomy, controls, and evaluation',
        tasks: [
          'Set an explicit goal, allowed tools, step limit, and stopping condition for an agent.',
          'Define what must be confirmed by a person before an agent changes external state.',
        ],
      },
    ],
  },
  {
    id: 'genai-m08',
    name: 'Module 08: Agent frameworks and graph workflows',
    duration: '35 min',
    description: 'Compare agent framework abstractions and understand stateful, conditional graph execution.',
    sections: [
      {
        id: 'frameworks',
        name: 'Framework landscape and tradeoffs',
        tasks: [
          'Compare a chain-oriented framework with a graph-oriented workflow for one use case.',
          'Choose between direct provider SDK calls and a framework using maintainability and control.',
        ],
      },
      {
        id: 'graph-model',
        name: 'Nodes, edges, and state',
        tasks: [
          'Represent a workflow as nodes that transform shared state.',
          'Use conditional edges to route based on validated state or tool results.',
          'Identify cycles, exit paths, retries, and checkpoints in a graph design.',
        ],
      },
    ],
  },
  {
    id: 'genai-m09',
    name: 'Module 09: ReAct agents and tools',
    duration: '1 hr 39 min',
    description: 'Build a bounded reason-act-observe loop with custom tools, visible execution, and memory.',
    sections: [
      {
        id: 'react-loop',
        name: 'ReAct execution model',
        tasks: [
          'Trace a request through model decision, tool action, observation, and final response.',
          'Visualize each step with tool name, validated input, result, and error state.',
        ],
      },
      {
        id: 'custom-tools',
        name: 'Custom tool implementation',
        tasks: [
          'Implement a read-only tool with typed inputs, output limits, and explicit errors.',
          'Add a state-changing tool with authorization and an approval boundary.',
          'Reject unknown tools and malformed arguments instead of trusting model output.',
        ],
      },
      {
        id: 'bounded-execution',
        name: 'Loop control and failure handling',
        tasks: [
          'Enforce maximum steps, tool timeouts, and a clear terminal response.',
          'Handle tool errors without exposing secrets or internal stack traces.',
        ],
      },
      {
        id: 'agent-memory',
        name: 'Agent memory',
        tasks: [
          'Separate the current execution state from persistent conversation memory.',
          'Trim or summarize history so memory remains relevant and within the model context.',
        ],
      },
    ],
  },
  {
    id: 'genai-m10',
    name: 'Module 10: ReAct agent with a state graph',
    duration: '1 hr 57 min',
    description: 'Rebuild an agent as an explicit graph with typed state, routing, and resumable execution.',
    sections: [
      {
        id: 'graph-state',
        name: 'Graph state and node design',
        tasks: [
          'Define typed state fields for the user request, messages, tool result, and completion status.',
          'Implement model and tool nodes with clear input/output state contracts.',
        ],
      },
      {
        id: 'routing',
        name: 'Edges, routing, and termination',
        tasks: [
          'Route tool calls to the correct tool node and return results to the model node.',
          'Add conditional paths for final answers, invalid requests, and tool failures.',
          'Prove every graph path reaches a terminal state within a bounded number of steps.',
        ],
      },
      {
        id: 'graph-memory',
        name: 'Checkpoints and memory',
        tasks: [
          'Persist graph state at a checkpoint and resume a paused execution.',
          'Keep durable conversation memory separate from short-lived execution state.',
        ],
      },
    ],
  },
  {
    id: 'genai-m11',
    name: 'Module 11: Google Calendar scheduling agent',
    duration: '4 hr 1 min',
    description: 'Design an agent that checks availability and schedules events with OAuth, time-zone care, and user approval.',
    sections: [
      {
        id: 'calendar-architecture',
        name: 'Architecture, authentication, and secrets',
        tasks: [
          'Diagram the client, agent service, tool server, and Google Calendar API boundary.',
          'Configure OAuth scopes for the minimum calendar access the feature needs.',
          'Keep client secrets and refresh tokens in server-side secret storage.',
        ],
      },
      {
        id: 'calendar-tools',
        name: 'Calendar tools and validation',
        tasks: [
          'Implement a get-events tool with date range and calendar access checks.',
          'Implement a create-event tool that validates attendee, title, and time fields.',
          'Require user confirmation before creating or modifying an event.',
        ],
      },
      {
        id: 'time-and-state',
        name: 'Time zones, memory, and interface',
        tasks: [
          'Convert local times to explicit time zones and test daylight-saving boundaries.',
          'Ask clarifying questions when a requested time or duration is ambiguous.',
          'Show planned event details and the result of the booking in the terminal or UI.',
        ],
      },
      {
        id: 'calendar-testing',
        name: 'Testing and operational safeguards',
        tasks: [
          'Test unavailable slots, expired credentials, duplicate requests, and API errors.',
          'Prevent retries from creating duplicate calendar events.',
          'Redact tokens and personal calendar details from logs.',
        ],
      },
    ],
  },
  {
    id: 'genai-m12',
    name: 'Module 12: Agent observability',
    duration: '1 hr 7 min',
    description: 'Trace model and tool execution to diagnose failures, latency, and usage in production.',
    sections: [
      {
        id: 'tracing',
        name: 'Traces and debugging',
        tasks: [
          'Capture a trace spanning request, model call, graph node, and tool execution.',
          'Compare tracing workflows in LangSmith and Langfuse using a sample run.',
          'Use traces to locate a wrong route, slow tool, or failed model response.',
        ],
      },
      {
        id: 'agent-metrics',
        name: 'Metrics, privacy, and operations',
        tasks: [
          'Track token usage, latency, tool success rate, retries, and estimated cost.',
          'Redact secrets and sensitive user content before exporting observability data.',
          'Create an alert for a meaningful failure or latency threshold.',
        ],
      },
    ],
  },
  {
    id: 'genai-m13',
    name: 'Module 13: Advanced RAG patterns',
    duration: '52 min',
    description: 'Improve retrieval with query routing, relevance grading, correction, and model self-checks.',
    sections: [
      {
        id: 'agentic-rag',
        name: 'Agentic retrieval',
        tasks: [
          'Route a question to retrieval only when the answer requires the indexed knowledge base.',
          'Let the workflow reformulate a query when the first retrieval is weak.',
        ],
      },
      {
        id: 'corrective-rag',
        name: 'Corrective RAG',
        tasks: [
          'Grade retrieved context for relevance before using it to generate an answer.',
          'Add a correction path for irrelevant or insufficient evidence.',
          'Return an explicit uncertainty or abstention when correction does not find evidence.',
        ],
      },
      {
        id: 'self-rag',
        name: 'Self-RAG and answer checks',
        tasks: [
          'Check whether an answer is supported by retrieved passages.',
          'Revise or reject answers that make claims not supported by the available sources.',
        ],
      },
    ],
  },
  {
    id: 'genai-m14',
    name: 'Module 14: Multi-domain customer support assistant',
    duration: '2 hr 48 min',
    description: 'Build a support workflow that routes requests to specialized, knowledge-grounded handlers.',
    sections: [
      {
        id: 'support-routing',
        name: 'Support graph and conditional routing',
        tasks: [
          'Define a support state and route requests by intent with a safe fallback.',
          'Keep front-desk triage separate from specialized support responsibilities.',
          'Test ambiguous, out-of-scope, and adversarial requests against the router.',
        ],
      },
      {
        id: 'specialists',
        name: 'Specialized support agents',
        tasks: [
          'Define focused front-desk, marketing-support, and learning-support behaviors.',
          'Pass only the relevant user context and task to each specialist.',
          'Combine specialist output into one consistent response without hiding uncertainty.',
        ],
      },
      {
        id: 'support-rag',
        name: 'Knowledge retrieval and answer quality',
        tasks: [
          'Index internal support documentation with metadata and access controls.',
          'Apply relevance grading and correction before a specialist uses retrieved context.',
          'Measure routing accuracy, groundedness, escalation quality, and response quality.',
        ],
      },
    ],
  },
  {
    id: 'genai-m15',
    name: 'Module 15: Reflection, planning, and research agents',
    duration: '3 hr 19 min',
    description: 'Use bounded critique and revision loops for writing and research tasks.',
    sections: [
      {
        id: 'agent-patterns',
        name: 'Reflection and plan-and-execute patterns',
        tasks: [
          'Compare a reflection loop with a plan-then-execute workflow.',
          'Set an iteration budget and measurable stopping criteria for agent revisions.',
          'Keep critique criteria explicit so a revision improves the requested outcome.',
        ],
      },
      {
        id: 'writing-agent',
        name: 'Writer and critic project',
        tasks: [
          'Build a draft node that creates content from a brief and audience constraints.',
          'Build a critic node that checks factuality, tone, and formatting against a rubric.',
          'Route revised drafts through a bounded loop and retain the final approved draft.',
        ],
      },
      {
        id: 'research-agent',
        name: 'Search and research project',
        tasks: [
          'Create a research plan that decomposes a question into answerable sub-questions.',
          'Search for evidence and attach source references to collected claims.',
          'Revise the report when evidence is missing, conflicting, or out of date.',
        ],
      },
    ],
  },
  {
    id: 'genai-m16',
    name: 'Module 16: Multi-agent systems',
    duration: '1 hr 18 min',
    description: 'Coordinate specialized agents under a supervisor while keeping handoffs and state controlled.',
    sections: [
      {
        id: 'agent-decomposition',
        name: 'Specialized agent boundaries',
        tasks: [
          'Decompose a complex task into independent specialist responsibilities.',
          'Give each specialist the minimum tools, context, and permissions required.',
        ],
      },
      {
        id: 'supervisor',
        name: 'Supervisor and handoffs',
        tasks: [
          'Build a supervisor that selects a specialist and validates its returned result.',
          'Define typed handoff data instead of passing unrestricted conversation histories.',
          'Prevent agents from repeatedly handing work to each other without progress.',
        ],
      },
      {
        id: 'multi-agent-evaluation',
        name: 'System-level evaluation',
        tasks: [
          'Trace and evaluate a complete multi-agent run, including failed handoffs.',
          'Compare the multi-agent design against a simpler single-agent workflow.',
        ],
      },
    ],
  },
  {
    id: 'genai-m17',
    name: 'Module 17: Human approval and interrupts',
    duration: '2 hr 2 min',
    description: 'Pause an agent at sensitive actions and resume only after an authorized person decides.',
    sections: [
      {
        id: 'interrupt-design',
        name: 'Human-in-the-loop design',
        tasks: [
          'Identify actions that require approval, such as sending, booking, deleting, or paying.',
          'Design an interrupt state that records the proposed action and its reason.',
          'Ensure the agent cannot perform the pending action before approval.',
        ],
      },
      {
        id: 'approval-ui',
        name: 'Approval and resume experience',
        tasks: [
          'Show a reviewer the exact action, parameters, and relevant context before approval.',
          'Support approve, reject, and request-changes outcomes with an audit trail.',
          'Resume from a saved checkpoint without repeating completed side effects.',
        ],
      },
      {
        id: 'approval-safety',
        name: 'Authorization and failure cases',
        tasks: [
          'Verify that the reviewer is authorized for the requested action.',
          'Handle expired approvals, timeouts, duplicate decisions, and revoked permissions.',
        ],
      },
    ],
  },
  {
    id: 'genai-m18',
    name: 'Module 18: Generative UI and streamed interfaces',
    duration: '6 hr 56 min',
    description: 'Stream structured results from an agent and render useful React widgets alongside conversation.',
    sections: [
      {
        id: 'generative-ui-design',
        name: 'Generative UI and application graph',
        tasks: [
          'Choose which responses should be a widget or chart rather than plain text.',
          'Model an expense-tracker workflow with explicit graph state and safe tool boundaries.',
          'Define typed UI payloads that can be validated before rendering.',
        ],
      },
      {
        id: 'ui-tools',
        name: 'Data and visualization tools',
        tasks: [
          'Implement expense query and update tools with validated inputs.',
          'Generate chart-ready data from trusted application results, not model-invented totals.',
          'Handle empty, partial, and invalid chart data in the UI.',
        ],
      },
      {
        id: 'streaming',
        name: 'Streaming and server-sent events',
        tasks: [
          'Stream progress and response events from server to client using SSE.',
          'Handle disconnects, cancellation, reconnection, and terminal stream events.',
          'Avoid exposing provider secrets or internal tool details in streamed payloads.',
        ],
      },
      {
        id: 'react-widgets',
        name: 'React widgets and interaction',
        tasks: [
          'Render validated chart, summary, or form widgets beside the assistant response.',
          'Keep interactive controls accessible and usable while the response is streaming.',
          'Test widget rendering for malformed events, slow responses, and API failures.',
        ],
      },
    ],
  },
  {
    id: 'genai-m19',
    name: 'Module 19: Model Context Protocol',
    duration: '4 hr 43 min',
    description: 'Build MCP servers and clients and connect models to tools, resources, and prompt templates.',
    sections: [
      {
        id: 'mcp-architecture',
        name: 'MCP architecture and primitives',
        tasks: [
          'Explain the roles of the host, client, and MCP server in a connection.',
          'Distinguish MCP tools, resources, and prompt templates by their purpose.',
          'Trace capability discovery and a tool invocation across the protocol boundary.',
        ],
      },
      {
        id: 'local-mcp',
        name: 'Local MCP server',
        tasks: [
          'Build a local server that exposes a small, well-scoped tool.',
          'Add a resource and prompt template with clear input and output contracts.',
          'Validate arguments and return actionable protocol errors.',
        ],
      },
      {
        id: 'remote-mcp',
        name: 'Remote MCP server and transport',
        tasks: [
          'Design a remote server connection with authentication and transport boundaries.',
          'Apply access controls, timeouts, and consent to remotely exposed tools.',
          'Debug connection lifecycle, capability discovery, and tool execution failures.',
        ],
      },
      {
        id: 'mcp-client',
        name: 'MCP client integration',
        tasks: [
          'Build a client that connects to a server and discovers available capabilities.',
          'Select and invoke a tool while validating its result before passing it to a model.',
          'Test unavailable servers, malformed responses, and tools with excessive output.',
        ],
      },
    ],
  },
  {
    id: 'genai-m20',
    name: 'Module 20: Multimodal AI image editor',
    duration: '8 hr 43 min',
    description: 'Build a canvas editing workspace with masks, history, and provider-backed image transformations.',
    sections: [
      {
        id: 'canvas-editor',
        name: 'Canvas and masking tools',
        tasks: [
          'Build a canvas that loads an image and supports brush, eraser, and rectangular selection.',
          'Represent an editable mask independently from the original image.',
          'Handle pointer scaling, canvas resizing, and high-density displays.',
        ],
      },
      {
        id: 'editor-history',
        name: 'Undo, redo, and editing state',
        tasks: [
          'Store edits as reversible operations or snapshots with a bounded history.',
          'Implement undo and redo without mutating earlier image states.',
          'Test history behavior after a new edit is made following undo.',
        ],
      },
      {
        id: 'image-generation',
        name: 'Image generation and remix flows',
        tasks: [
          'Create a server-side image generation request from a validated prompt and mask.',
          'Add remix, style transformation, and image-expansion workflows.',
          'Handle long-running jobs, provider errors, cancellation, and result previews.',
        ],
      },
      {
        id: 'image-safety',
        name: 'Multimodal input and file safety',
        tasks: [
          'Validate file type, dimensions, and size before accepting image input.',
          'Keep provider credentials server-side and avoid logging image contents.',
          'Test mask alignment and output handling with transparent and unusual-sized images.',
        ],
      },
    ],
  },
  {
    id: 'genai-m21',
    name: 'Module 21: Real-time AI language tutor',
    duration: '9 hr 2 min',
    description: 'Build a low-latency voice tutor with streaming audio, transcription, playback, and interruption.',
    sections: [
      {
        id: 'audio-session',
        name: 'Audio permissions and session lifecycle',
        tasks: [
          'Request microphone permission at the point the learner starts a session.',
          'Represent connecting, active, interrupted, failed, and ended session states.',
          'Recover from denied permissions and dropped network connections.',
        ],
      },
      {
        id: 'audio-streaming',
        name: 'PCM audio and streaming playback',
        tasks: [
          'Inspect sample rate, channel count, and 16-bit PCM format for incoming audio.',
          'Stream audio chunks with buffering that balances latency and playback smoothness.',
          'Stop or replace current playback immediately when the learner interrupts.',
        ],
      },
      {
        id: 'voice-ai',
        name: 'Transcription, credentials, and tutor behavior',
        tasks: [
          'Display partial and final transcriptions with clear turn boundaries.',
          'Issue ephemeral credentials through a secure server-side session endpoint.',
          'Keep the tutor response aligned with learner level and the current lesson goal.',
          'Test latency, interruption, reconnect, and cleanup of microphone/audio resources.',
        ],
      },
    ],
  },
  {
    id: 'genai-m22',
    name: 'Module 22: Full-stack AI SaaS capstone',
    duration: '13 hr 50 min',
    description: 'Combine authentication, persistent chat, model providers, streaming, billing, and usage controls in a deployable product.',
    sections: [
      {
        id: 'saas-foundation',
        name: 'Architecture, database, and authentication',
        tasks: [
          'Design a full-stack architecture and run PostgreSQL in Docker for development.',
          'Model users, conversations, messages, provider settings, and usage records.',
          'Configure Better Auth for email, Google, and GitHub sign-in with protected routes.',
          'Enforce tenant boundaries so users can access only their own data.',
        ],
      },
      {
        id: 'model-platform',
        name: 'Model selection and server streaming',
        tasks: [
          'Route requests through a provider abstraction that supports multiple models.',
          'Stream responses from a protected backend endpoint to the chat interface.',
          'Persist threaded messages and recover gracefully from interrupted streams.',
          'Render tool-call requests and validated tool results inline in the conversation.',
        ],
      },
      {
        id: 'memory-and-tools',
        name: 'Conversation memory and tools',
        tasks: [
          'Implement short-term context management for long conversation threads.',
          'Design opt-in long-term memory with clear user visibility and deletion controls.',
          'Authorize every tool against the current user and validate all side effects.',
        ],
      },
      {
        id: 'billing',
        name: 'Subscriptions, credits, and access tiers',
        tasks: [
          'Model plans, entitlements, and credit balances on the server.',
          'Integrate Polar subscriptions and process signed payment webhooks idempotently.',
          'Enforce usage limits and tier access before starting costly model requests.',
          'Handle cancellations, failed payments, refunds, and credit reconciliation.',
        ],
      },
      {
        id: 'production-readiness',
        name: 'Security, quality, and deployment',
        tasks: [
          'Add tests for authentication, tenant isolation, billing, and model failure paths.',
          'Track latency, token usage, cost, and errors without logging secrets.',
          'Document environment setup, migrations, deployment, and incident recovery.',
          'Complete a production-readiness review for privacy, rate limits, and abuse controls.',
        ],
      },
    ],
  },
];

export const GENAI_ROADMAP: Roadmap = {
  id: 'genai-agentic-ai',
  name: 'GenAI + Agentic AI',
  description: 'A project-first JavaScript learning path from LLM foundations and RAG to tool-using agents, MCP, multimodal apps, and a production AI SaaS capstone.',
  emoji: '🤖',
  type: 'predefined',
  duration: '22 modules',
  color: 'violet',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  topics: curriculum.map(createModuleTopic),
};
