import * as tasksRepo from "@/lib/dal/tasks.repository";
import * as todosRepo from "@/lib/dal/todos.repository";


export async function seedDataForUser(userId: string) {
    const task1 = await tasksRepo.insertTask({ userId, title: "Courses" });
    const task2 = await tasksRepo.insertTask({ userId, title: "Projet Next.js" });

    await todosRepo.insertManyTodos([
        { content: "Acheter du lait", taskId: task1.id, sortPosition: 0 },
        { content: "Acheter du pain", taskId: task1.id, sortPosition: 1 },
        { content: "Acheter des oeufs", taskId: task1.id, sortPosition: 2, isDone: true },
    ]);

    await todosRepo.insertManyTodos([
        { content: "Regarder la video tutorial concernant better auth",taskId: task2.id,sortPosition: 0,isDone: true},
        { content: "Créer le CRUD des tasks", taskId: task2.id, sortPosition: 1 },
        { content: "Faire un UI", taskId: task2.id, sortPosition: 2 },
    ]);
}

export async function clearAllTasksForUser(userId: string) {
    await tasksRepo.deleteAllTasks({userId:userId});
}
