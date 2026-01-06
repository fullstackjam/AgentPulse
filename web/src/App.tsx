import { useAgents } from "./hooks/useAgents";
import {
  Header,
  Footer,
  StatsCards,
  AgentTable,
  LoadingSkeleton,
} from "./components";

export default function App() {
  const { data, loading, error } = useAgents();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Header timestamp={data?.timestamp ?? null} />

        {loading && <LoadingSkeleton />}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-400">Failed to load data: {error}</p>
          </div>
        )}

        {data && !loading && (
          <>
            <StatsCards agents={data.agents} />
            <AgentTable agents={data.agents} />
          </>
        )}

        <Footer />
      </div>
    </div>
  );
}
