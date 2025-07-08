"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Wallet,
  CheckCircle2,
  Clock,
  Plus,
  ListTodo,
  Target,
  Coins,
  Calendar,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react"

interface Task {
  id: number
  name: string
  description: string
  status: "pending" | "completed"
  createdAt: Date
  completedAt?: Date
  weiStake: number
}

export default function Web3TodoApp() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: "Estudar Smart Contracts",
      description: "Completar curso de Solidity e implementar primeiro contrato",
      status: "completed",
      createdAt: new Date("2024-01-15"),
      completedAt: new Date("2024-01-20"),
      weiStake: 1000000000000000000, // 1 ETH em wei
    },
    {
      id: 2,
      name: "Deploy na Testnet",
      description: "Fazer deploy do contrato TODO na rede de teste Sepolia",
      status: "pending",
      createdAt: new Date("2024-01-18"),
      weiStake: 500000000000000000, // 0.5 ETH em wei
    },
    {
      id: 3,
      name: "Integrar Frontend",
      description: "Conectar interface React com smart contract usando ethers.js",
      status: "pending",
      createdAt: new Date("2024-01-20"),
      weiStake: 750000000000000000, // 0.75 ETH em wei
    },
  ])

  const [newTask, setNewTask] = useState({ name: "", description: "", weiStake: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [completingTask, setCompletingTask] = useState<number | null>(null)

  const connectWallet = async () => {
    setIsConnecting(true)
    // Simular conexão da carteira
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsWalletConnected(true)
    setWalletAddress("0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF")
    setIsConnecting(false)
  }

  const disconnectWallet = () => {
    setIsWalletConnected(false)
    setWalletAddress("")
  }

  const addTask = () => {
    if (newTask.name.trim() && newTask.description.trim() && newTask.weiStake) {
      const task: Task = {
        id: Date.now(),
        name: newTask.name.trim(),
        description: newTask.description.trim(),
        status: "pending",
        createdAt: new Date(),
        weiStake: Number.parseFloat(newTask.weiStake) * 1000000000000000000, // Converter ETH para wei
      }
      setTasks([...tasks, task])
      setNewTask({ name: "", description: "", weiStake: "" })
      setIsDialogOpen(false)
    }
  }

  const completeTask = async (id: number) => {
    setCompletingTask(id)
    // Simular transação blockchain
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status: "completed" as const, completedAt: new Date() } : task)),
    )
    setCompletingTask(null)
  }

  const formatWei = (wei: number) => {
    return (wei / 1000000000000000000).toFixed(3) + " ETH"
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Métricas
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const totalWeiStake = tasks.reduce((sum, task) => sum + task.weiStake, 0)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <ListTodo className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">WEB3 TODO – Lista de Tarefas com Conexão Web3</h1>
            </div>

            <div className="flex items-center space-x-4">
              {isWalletConnected && (
                <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{formatAddress(walletAddress)}</span>
                </div>
              )}

              <Button
                onClick={isWalletConnected ? disconnectWallet : connectWallet}
                disabled={isConnecting}
                className={`${
                  isWalletConnected ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                } transition-all duration-200`}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : isWalletConnected ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Carteira Conectada
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Conectar Carteira
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Alert */}
          {!isWalletConnected && (
            <Alert className="mt-4 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Conecte sua carteira para gerenciar suas tarefas na blockchain.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Métricas */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Métricas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total de Tarefas</p>
                    <p className="text-3xl font-bold text-slate-900">{totalTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ListTodo className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Tarefas Concluídas</p>
                    <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Tarefas Pendentes</p>
                    <p className="text-3xl font-bold text-cyan-600">{pendingTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-cyan-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Wei em Stake</p>
                    <p className="text-2xl font-bold text-purple-600">{formatWei(totalWeiStake)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Coins className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tarefas */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Tarefas</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  disabled={!isWalletConnected}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Nova Tarefa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Tarefa</Label>
                    <Input
                      id="name"
                      value={newTask.name}
                      onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                      placeholder="Digite o nome da tarefa..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Descreva a tarefa..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stake">Stake (ETH)</Label>
                    <Input
                      id="stake"
                      type="number"
                      step="0.001"
                      value={newTask.weiStake}
                      onChange={(e) => setNewTask({ ...newTask, weiStake: e.target.value })}
                      placeholder="0.000"
                    />
                  </div>
                  <Button
                    onClick={addTask}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!newTask.name.trim() || !newTask.description.trim() || !newTask.weiStake}
                  >
                    Criar Tarefa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {!isWalletConnected ? (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <Wallet className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Carteira Não Conectada</h3>
                <p className="text-slate-600">Conecte sua carteira para visualizar e gerenciar suas tarefas.</p>
              </CardContent>
            </Card>
          ) : tasks.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma Tarefa</h3>
                <p className="text-slate-600">Crie sua primeira tarefa para começar!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  className={`border transition-all duration-200 hover:shadow-md ${
                    task.status === "completed" ? "border-green-200 bg-green-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3
                            className={`text-lg font-semibold ${
                              task.status === "completed" ? "text-green-800" : "text-slate-900"
                            }`}
                          >
                            {task.name}
                          </h3>
                          <Badge
                            variant={task.status === "completed" ? "default" : "secondary"}
                            className={task.status === "completed" ? "bg-green-600" : "bg-slate-600"}
                          >
                            {task.status === "completed" ? "Concluída" : "Pendente"}
                          </Badge>
                        </div>

                        <p
                          className={`text-sm mb-3 ${
                            task.status === "completed" ? "text-green-700" : "text-slate-600"
                          }`}
                        >
                          {task.description}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Criada: {task.createdAt.toLocaleDateString("pt-BR")}</span>
                          </div>
                          {task.completedAt && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Concluída: {task.completedAt.toLocaleDateString("pt-BR")}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Coins className="h-3 w-3" />
                            <span>Stake: {formatWei(task.weiStake)}</span>
                          </div>
                        </div>
                      </div>

                      {task.status === "pending" && (
                        <Button
                          onClick={() => completeTask(task.id)}
                          disabled={completingTask === task.id}
                          className="ml-4 bg-green-600 hover:bg-green-700 transition-colors duration-200"
                        >
                          {completingTask === task.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processando...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Concluir Tarefa
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
