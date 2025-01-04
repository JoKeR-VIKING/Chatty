import { Server, Socket } from 'socket.io';

let chatSocketObject: Server;
const onlineUsers = new Map<string, string>();

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
        onlineUsers.set(socket.id, _id);
        this.io.emit('post-online', { _id: _id, status: true });
      });

      socket.on('unregister', (_id: string) => {
        socket.leave(_id);
        onlineUsers.delete(socket.id);
        this.io.emit('post-online', { _id: _id, status: false });
      });

      socket.on('get-online', (_id: string) => {
        const isOnline = Array.from(onlineUsers.values()).includes(_id);
        socket.emit('post-online', { _id: _id, status: isOnline });
      });

      socket.on('disconnect', () => {
        this.io.emit('post-online', {
          _id: onlineUsers.get(socket.id),
          status: false,
        });
        onlineUsers.delete(socket.id);
      });
    });
  }
}

export { chatSocketObject };
export default ChatSocketHandler;
