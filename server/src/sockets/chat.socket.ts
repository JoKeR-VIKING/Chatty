import { Server, Socket } from 'socket.io';

let chatSocketObject: Server;

class ChatSocketHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    chatSocketObject = io;
  }

  public listen() {
    this.io.on('connection', (socket: Socket) => {
      socket.on('register', (_id: string) => {
        socket.join(_id);
        console.log(`User ${_id} has connected`);
      });

      socket.on('disconnect', () => {
        console.log('disconnected');
      });
    });
  }
}

export { chatSocketObject };
export default ChatSocketHandler;
