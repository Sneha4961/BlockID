import React, { useState } from "react";
import { BlockchainBlock, BlockchainTx } from "../types";
import { SMART_CONTRACT_SOL } from "../data/initialState";
import { sha256Hex, truncateHash } from "../lib/cryptoUtils";
import {
  Cpu,
  Layers,
  Code2,
  Play,
  CheckCircle2,
  Activity,
  FileCode,
  Flame,
  Globe,
  Database,
  Search,
  Zap,
} from "lucide-react";

interface SmartContractExplorerProps {
  blocks: BlockchainBlock[];
  onMineBlock: (newBlock: BlockchainBlock) => void;
}

export const SmartContractExplorer: React.FC<SmartContractExplorerProps> = ({
  blocks,
  onMineBlock,
}) => {
  const [activeTab, setActiveTab] = useState<"blocks" | "contract">("blocks");
  const [isMining, setIsMining] = useState(false);

  const handleMineBlock = async () => {
    setIsMining(true);
    try {
      const topBlock = blocks[0];
      const newHeight = (topBlock?.blockHeight || 1042890) + 1;
      const prevHash = topBlock?.hash || "0x00003a8f29bc10e9281aef029bc38e91023a4b5c6d7e8f9a0b1c2d3e4f5a6b7c";
      
      const nonce = Math.floor(Math.random() * 1000000);
      const rawHash = await sha256Hex(`block_${newHeight}_${prevHash}_${nonce}`);
      const newHash = `0x0000${rawHash.substring(0, 60)}`;
      const merkleRoot = `0x${(await sha256Hex(`merkle_${newHeight}`)).substring(0, 64)}`;

      const newTx: BlockchainTx = {
        txHash: `0x${(await sha256Hex(`tx_${nonce}`)).substring(0, 64)}`,
        blockHeight: newHeight,
        type: "ZK_PROOF_VERIFY",
        senderDid: "did:blockid:0x8f3a1e94b27c6051d9e24a87310bc94f",
        contractAddress: "0xZKProofVerifierContract002",
        timestamp: new Date().toISOString(),
        status: "SUCCESS",
        gasFee: "0.0007 ETH",
        details: "Executed real-time zk-SNARK claim verification on BlockIDRegistry.sol",
      };

      const newBlock: BlockchainBlock = {
        blockHeight: newHeight,
        hash: newHash,
        previousHash: prevHash,
        merkleRoot,
        timestamp: new Date().toISOString(),
        transactionsCount: 1,
        miner: "BlockID_Validator_Node_01",
        gasUsed: Math.floor(60000 + Math.random() * 40000),
        transactions: [newTx],
      };

      onMineBlock(newBlock);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMining(false);
    }
  };

  const allTxList = blocks.flatMap((b) => b.transactions);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-lg">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Blockchain Ledger & Smart Contract Inspector
              <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                EVM Compatible
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live block height, transaction logs, Merkle root hashes, and Solidity contract source code.
            </p>
          </div>
        </div>

        <button
          onClick={handleMineBlock}
          disabled={isMining}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all disabled:opacity-50 shrink-0"
        >
          {isMining ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Mining Block...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-yellow-300" />
              Mine Next Block
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("blocks")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "blocks"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Live Blocks & Transactions ({blocks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("contract")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "contract"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Solidity Source Code (BlockIDRegistry.sol)</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === "blocks" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blocks Feed */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              Mined Blocks Stream
            </h3>

            <div className="space-y-4">
              {blocks.map((block) => (
                <div
                  key={block.blockHeight}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-sm text-purple-300">
                        Block #{block.blockHeight}
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
                        {block.transactionsCount} Transactions
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(block.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-500">Block Hash:</p>
                      <p className="text-indigo-300 font-semibold truncate">{block.hash}</p>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-500">Previous Hash:</p>
                      <p className="text-slate-400 font-semibold truncate">{block.previousHash}</p>
                    </div>
                  </div>

                  {/* Transactions inside this block */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Included Smart Contract Calls:
                    </p>
                    <div className="space-y-1.5">
                      {block.transactions.map((tx) => (
                        <div
                          key={tx.txHash}
                          className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-300 font-mono text-[11px]">
                              {tx.type}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{tx.gasFee}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{tx.details}</p>
                          <p className="text-[10px] font-mono text-slate-500 truncate">
                            Tx: {tx.txHash}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: On-Chain Stats */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Network Telemetry
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Consensus Engine:</span>
                  <span className="font-bold text-white font-mono">Proof-of-Stake (PoS)</span>
                </div>

                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Network Latency:</span>
                  <span className="font-bold text-emerald-400 font-mono">1.2 ms (Sub-second)</span>
                </div>

                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Total Transactions:</span>
                  <span className="font-bold text-purple-300 font-mono">{allTxList.length} Executed</span>
                </div>

                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Smart Contract:</span>
                  <span className="font-bold text-indigo-300 font-mono truncate max-w-[150px]">
                    0xBlockIDRegistry...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Solidity Code tab */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <FileCode className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-sm">BlockIDRegistry.sol</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Solidity ^0.8.20</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto max-h-[600px] scrollbar-thin">
            <pre>{SMART_CONTRACT_SOL}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
