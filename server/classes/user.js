class User{

    constructor(){
        this.people = [];
    }

    addPleople(id, name, room){
        let people = {id, name, room};
        this.people.push(people);

        return this.people;
    }

    deletePeople(id){
        let peopleDrop = this.getPeopleById(id);
        this.people = this.people.filter(people => people.id != id);
        return peopleDrop;
    }

    getPeopleById(id){
        let people = this.people.filter(people => people.id === id)[0];

        return people;
    }

    getPeople(){
        return this.people;
    }

    getPeopleByRoom(room){
        let peopleInRoom = this.people.filter(people => people.room === room);
        return peopleInRoom;
    }

    

}

module.exports = {
    User
}