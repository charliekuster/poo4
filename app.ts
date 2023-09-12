import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import crypto from 'crypto'

export class App {
    users: User[] = []
    bikes: Bike[] = []
    rents: Rent[] = []

    findUser(email: string): User {
        const user = this.users.find(user => user.email === email);
        if (user === undefined) {
            throw new Error('User not found.');
        }
        return user;
    }

    registerUser(user: User): string {
        for (const rUser of this.users) {
            if (rUser.email === user.email) {
                throw new Error('Duplicate user.')
            }
        }
        const newId = crypto.randomUUID()
        user.id = newId
        this.users.push(user)
        return newId
    }

    registerBike(bike: Bike): string {
        const newId = crypto.randomUUID()
        bike.id = newId
        this.bikes.push(bike)
        return newId
    }

    removeUser(email: string): void {
        const userIndex = this.users.findIndex(user => user.email === email)
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1)
            return
        }
        throw new Error('User does not exist.')
    }
    
    rentBike(bikeId: string, userEmail: string, startDate: Date): void {
        const bike = this.bikes.find(bike => bike.id === bikeId)
        if (!bike) {
            throw new Error('Bike not found.')
        }
        const user = this.findUser(userEmail)
        if (!user) {
            throw new Error('User not found.')
        }
        if(!bike.available){
            throw new Error('Bike not available')
        }
        const now = new Date()
        const newRent = new Rent (bike,user,now);

        this.rents.push(newRent)
    }

    returnBike(bikeId: string, userEmail: string): number{
        const today = new Date()
        const rent = this.rents.find(rent => 
            rent.bike.id === bikeId &&
            rent.user.email === userEmail &&
            rent.end === undefined &&
            rent.start <= today
        )
        if (rent) {
            rent.end = today

            return 
        }
        throw new Error('Rent not found.')
    }
    function  diff_hours(params:type) {
        
    }
    listUsers(): void{
        console.log("Lista de Usuários:\n");
        this.users.forEach((user) => {
            console.log(`Nome: ${user.name}\n Email: ${user.email}\n Senha: ${user.password}\n ID: ${user.id}\n` );
          });
    }

    listBikes(): void{
        console.log("Lista de Bikes:\n");
        this.bikes.forEach((bike) => {
            console.log(`Nome: ${bike.name}\n Tipo: ${bike.type}\n Tamanho: ${bike.bodySize}\n Capacidade: ${bike.maxLoad}\n Nota: ${bike.rate}\n Descrição: ${bike.description}\n Avaliações: ${bike.ratings}\n Foto: ${bike.imageUrls}\n ID: ${bike.id}\n` );
          });
    }

    listRents(): void{
        console.log("Lista de Aluguéis:\n");
        this.rents.forEach((rent) => {
            console.log(`Bike: ${rent.bike.name}\n Usuário: ${rent.user.name}\n Data que foi alugada: ${rent.dateFrom}\n Data de devolução: ${rent.dateTo}\n Data que foi devolvida: ${rent.dateReturned}\n` );
          });
    }
}
