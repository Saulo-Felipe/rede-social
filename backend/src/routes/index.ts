import { Router } from "express";
import path from "path";
import { prisma } from "../../prisma/prismaClient";

const index = Router();


interface searchParams {
  searchQuery: string;
}

index.get("/404", (request, response) => {
  return response.status(404).json({ error: true });
});

index.get("/test", async (request, response) => {
  try {
    return response.json({ success: true });

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "ErroR: "+e });
  }
});

index.get("/search/:searchQuery", async (request, response) => {
  try {
    const { searchQuery }: searchParams = request.params;

    console.log(searchQuery);
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        image_url: true
      },
      where: {
        username: {
          contains: searchQuery,
          mode: "insensitive"
        }
      }
    });

    return response.json({ 
      success: true, 
      users: users.map(user => ({ 
        ...user, 
        image_url: user.image_url || process.env.SERVER_URL+"/images/user/profile-user.png" 
      })
    )});

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro ao pesquisar usuários" });
  }
});


interface getImageParams {
  image: string;
}

index.get("/images/user/:image", (request, response) => {
  try {
    const { image }: getImageParams = request.params;

    return response.sendFile(path.join(__dirname, "../public/images/user/"+image));

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro. Arquivo inválido." });
  }
});


index.get("/images/post/:image", (request, response) => {
  try {
    const { image }: getImageParams = request.params;

    return response.sendFile(path.join(__dirname, "../public/images/posts/"+image));

  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Erro. Arquivo inválido." });
  }
});


interface AllMessagesBody {
  index: number;
}

index.post("/all-messages", async (request, response) => {
  try {
    let { index }: AllMessagesBody = request.body;

    const messagesLimitPerPage = 5;

    const messages = await prisma.global_messages.findMany({
      skip: messagesLimitPerPage*index,
      take: messagesLimitPerPage,
      orderBy: {
        id: "desc"
      }
    })

    return response.json({ success: true, messages });
    
  } catch(e) {
    console.log('----| Error |-----: ', e);
    return response.status(500).json({ error: true, message: "Eror ao buscar mensagens." });
  }
});

export { index }