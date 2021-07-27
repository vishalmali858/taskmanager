require('../db/mongoosedb.js');

const Users = require('../model/Users.js');
const Tasks = require('../model/Tasks.js');

/* Tasks.findByIdAndDelete('60fd1c4e21ff2723d08447b1').then(()=> {
	return Tasks.countDocuments({ completed: false})
}).then((result)=> {
	console.log(result);
}).catch((error)=>{
	console.log(error);
}); */

// const updateAgeAndCount = async (id, age) => {
// 	const User = await Users.findByIdAndUpdate(id, { age });
// 	const Count = await Users.countDocuments({ age: 0 });
// 	return Count
// }


// updateAgeAndCount('60fd1ac35087cc0b788a65a8', 2).then((count)=> {
// 	console.log(count);
// }).catch((error)=> {
// 	console.log(error)
// });

const deletebyIdAndCount = async (id) => {
	const Task = await Tasks.findByIdAndDelete(id);
	const count = await Tasks.countDocuments({ completed: true });
	return count
}

deletebyIdAndCount("60fd18bdabe57e22b840753d").then((result)=>{
	console.log(result)
}).catch((error)=>{
	console.log(error)
});