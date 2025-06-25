interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  id: string;
  email: string;
}

interface User {
  id: string;
  email: string;
}

type GenerateProps = {
  params: {
    topic: string;
  };
};

interface Task {
  text: string;
  done: boolean;
  id: number;
  taskPromptId: number;
}

interface Topic {
  id: number;
  title: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}
