
const agents = [
    {
        "agentId": 316886,
        "age": 23,
        "name": "Anthony Coyle-Dowling",
        "email": "ted.pursiainen@esny.se"
    },
    {
        "agentId": 321103,
        "age": 18,
        "name": "Elisa Mallia",
        "email": "elise.mallia@kwuk.com"
    },
    {
        "agentId": 319259,
        "age": 30,
        "name": "Josh Webber",
        "email": "josh.webber@kwuk.com"
    },
    {
        "agentId": 346086,
        "age": 12,
        "name": "Michael Watson",
        "email": "michael.watson@kwuk.com"
    },
    {
        "agentId": 307836,
        "age": 36,
        "name": "Oliver Keast",
        "email": "oliver.keast@kwuk.com"
    },
    {
        "agentId": 307816,
        "age": 13,
        "name": "Sandeep Chana",
        "email": "sandeep.chana@kwuk.com"
    },
    {
        "agentId": 319895,
        "age": 26,
        "name": "Shaun Nicholas",
        "email": "shaun.nicholas@kwuk.com"
    },
    {
        "agentId": 362116,
        "name": "Steve Jeal",
        "age": 29,
        "email": "steve.jeal@kwuk.com"
    },
    {
        "agentId": 359932,
        "age": 33,
        "name": "Temi Odulaja",
        "email": "temi.odulaja@kwuk.com"
    },
    {
        "agentId": 325078,
        "age": 30,
        "name": "Vicotria Bhoday",
        "email": "victoria.bhoday@kwuk.com"
    },
    {
        "agentId": 310719,
        "age": 43,

        "name": "Yufei Hu",
        "email": "yufei.hu@kwuk.com"
    }
]

const ageGroup = (age) => {
    if (age > 0 && age <= 12) {
        return 1
    } else if (age > 12 && age <= 18) {
        return 2
    } else if (age > 18 && age <= 24) {
        return 3
    } else if (age > 24 && age <= 36) {
        return 4
    } else if (age > 36 && age <= 50) {
        return 5
    } else {
        return 0
    }
}

const reduceExamples = () => {
    const desc = `The reduce() method executes a user-supplied "reducer" callback function on each element of the array, in order, passing in the return value from the calculation on the preceding element. The final result of running the reducer across all elements of the array is a single value.

    The first time that the callback is run there is no "return value of the previous calculation". If supplied, an initial value may be used in its place. Otherwise the array element at index 0 is used as the initial value and iteration starts from the next element (index 1 instead of index 0).`
    const sum = agents.reduce((total, obj) => {
        return total + obj.agentId;
    }, 0);

    const grouppingData = agents.reduce((newobj, obj) => {
        const ageGroupNumber = ageGroup(obj.age);
        (newobj[ageGroupNumber] = newobj[ageGroupNumber] || []).push(obj);
        return newobj;
    }, {});

    // const filterData = agents.reduce((newobj, obj) => {
    //     if (obj.age > 20) {
    //         return newobj.push(obj);
    //     }
    // }, []);

    return { desc, sum, grouppingData }
}



const sliceExamples = () => {
    const desc = `The slice method returns a shallow copy of a portion of an array into a new array object selected from start to end (end not included) where start and end represent the index of items in that array. The original array will not be modified.`
    const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

    const singleParam = animals.slice(2);
    // Expected output: Array ["camel", "duck", "elephant"]

    const twoParams = animals.slice(2, 4);
    // Expected output: Array ["camel", "duck"]

    // console.log(animals.slice(1, 5));
    // Expected output: Array ["bison", "camel", "duck", "elephant"]

    const singleFromEnd = animals.slice(-2);
    // Expected output: Array ["duck", "elephant"]

    const startFromLast = animals.slice(2, -1);
    // Expected output: Array ["camel", "duck"]

    const withNoParams = animals.slice();
    // Expected output: Array ["ant", "bison", "camel", "duck", "elephant"]

    return { desc, animals, singleParam, twoParams, singleFromEnd, startFromLast, withNoParams }

}

const spliceExamples = () => {
    const desc = `The splice method changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.`
    const monthsV1 = ['Jan', 'March', 'April', 'June'];
    const monthsV2 = ['Jan', "Feb", 'March', 'April', 'June'];
    const addNewIndex = monthsV1.splice(1, 0, 'Feb');
    // Inserts at index 1
    // console.log(months);
    // Expected output: Array ["Jan", "Feb", "March", "April", "June"]

    const replaceItem = monthsV1.splice(4, 1, 'May');
    const cuttingArray = monthsV2.splice(0, 1);
    // Replaces 1 element at index 4
    // console.log(months);
    // Expected output: Array ["Jan", "Feb", "March", "April", "May"]

    return { desc, monthsV1, monthsV2, addNewIndex, replaceItem, cuttingArray }

};
const joinExamples = () => {
    const desc = `The join() method creates and returns a new string by concatenating all of the elements in an array (or an array-like object), separated by commas or a specified separator string. If the array has only one item, then that item will be returned without using the separator.`
    const elements = ['Fire', 'Air', 'Water'];

    const defaultJoin = elements.join();
    // Expected output: "Fire,Air,Water"

    const customJoinerEmplty = elements.join('');
    // Expected output: "FireAirWater"
    const customJoinerDash = elements.join('-');
    // Expected output: "Fire-Air-Water"

    return { desc, elements, defaultJoin, customJoinerEmplty, customJoinerDash }

};

const flatExamples = () => {
    const desc = `The flat() method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.`
    const arr1 = [0, 1, 2, [3, 4], [[3, 4]]];

    const defaultParams = arr1.flat();
    // Expected output: Array [0, 1, 2, 3, 4]

    const arr2 = [0, 1, 2, [[[3, 4]]]];

    const paramDepth = arr2.flat(2);
    // Expected output: Array [0, 1, 2, Array [3, 4]]

    const arr3 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
    const infiniteDepth = arr3.flat(Infinity);

    return { desc, arr1, defaultParams, arr2, paramDepth, infiniteDepth }
}

const fillExampes = () => {
    const desc = `The fill() method changes all elements in an array to a static value, from a start index (default 0) to an end index (default array.length). It returns the modified array.`
    const array1 = [1, 2, 3, 4];

    // Fill with 0 from position 2 until position 4
    const customStartEnd = array1.fill(0, 2, 4);
    // Expected output: Array [1, 2, 0, 0]

    // Fill with 5 from position 1
    const justStartParam = array1.fill(5, 1);
    // Expected output: Array [1, 5, 5, 5]

    const justRepacerValue = array1.fill(6);

    // Expected output: Array [6, 6, 6, 6]

    const startFromEnd = array1.fill(4, -3, -2); // [4, 2, 3]
    return { array1, customStartEnd, justStartParam, justRepacerValue, startFromEnd }
}
const atExamples = () => {
    const desc = `The at() method takes an integer value and returns the item at that index, allowing for positive and negative integers. Negative integers count back from the last item in the array.`
    const array1 = [5, 12, 8, 130, 44];

    let index = 2;

    const positiveIndex = `Using an index of ${index} the item returned is ${array1.at(index)}`;
    // Expected output: "Using an index of 2 the item returned is 8"

    index = -2;

    const nagetiveIndex = `Using an index of ${index} item returned is ${array1.at(index)}`;
    // Expected output: "Using an index of -2 item returned is 130"

    return { desc, positiveIndex, nagetiveIndex }

}
module.exports = {
    reduceExamples,
    sliceExamples,
    spliceExamples,
    joinExamples,
    flatExamples,
    atExamples
}