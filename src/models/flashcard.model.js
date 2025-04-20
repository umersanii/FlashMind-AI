
class FlashCard {
    // constructor(id, front, back) {
    //     this.id = id;
    //     this.front = front;
    //     this.back = back;
    // }
    constructor(front, back) {
        this.front = front;
        this.back = back;
    }
    // json constructor
    static fromJSON(json) {
        return new FlashCard(json.id, json.front, json.back);
    }
    getId() {
        return this.id;
    }
    getFront() {
        return this.front;
    }
    getBack() {
        return this.back;
    }
    setFront(front) {
        this.front = front;
    }
    setBack(back) {
        this.back = back;
    }
    toJSON() {
        return {
            id: this.id,
            front: this.front,
            back: this.back
        };
    }
    static fromJSON(json) {
        return new FlashCard(json.id, json.front, json.back);
    }
}

export default FlashCard;