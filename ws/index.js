const { Server } = require('socket.io');
let io;
function initWebSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });
    io.on('connection', (socket) => {
        console.log('WS connected:', socket.id);
        socket.on('join', (data) => {
            const { jadwal_seleksi_id, peserta_seleksi_id, role } = data;
            if (jadwal_seleksi_id) {
                const room = `jadwal_${jadwal_seleksi_id}`;
                socket.join(room);
                console.log(`${role} join ${room}`);
            }
            if (peserta_seleksi_id) {
                const room = `peserta_${peserta_seleksi_id}`;
                socket.join(room);
                console.log(`${role} join ${room}`);
            }
        });

        socket.on('peserta:progress', (data) => {
            const { jadwal_seleksi_id, peserta_seleksi_id } = data;
            io.to(`jadwal_${jadwal_seleksi_id}`).emit('peserta:progress', {
                peserta_seleksi_id
            });
        });        

        socket.on('pengawas:progress', (data) => {
            const { jadwal_seleksi_id, peserta_seleksi_id } = data;
            io.to(`jadwal_${jadwal_seleksi_id}`).emit('pengawas:progress', {
                peserta_seleksi_id
            });
        });        

        socket.on('pengawas:sesi', (data) => {
            const { jadwal_seleksi_id, is_mulai, is_selesai } = data;
            io.to(`jadwal_${jadwal_seleksi_id}`).emit('pengawas:sesi', {
                jadwal_seleksi_id, is_mulai, is_selesai
            });
        });        

        socket.on('disconnect', () => {
            console.log('WS disconnected:', socket.id);
        });
    });

    return io;
}

function getIO() {
    if (!io) throw new Error('Socket.io belum di-init');
    return io;
}

module.exports = {
    initWebSocket,
    getIO
};