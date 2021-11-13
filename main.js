const express = require('express')
const app = express();
const fs = require('fs');
const path = 'data.txt';
const multer = require('multer');
const port = 3000
const upload = multer({dest:"uploads"});

app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.urlencoded({extended:false}));
app.use(express.json())

app.get('/todo', (req, res) => {
	read(path,(err,data)=>{
		res.end(data);
	})
})

app.post('/save',(req,res)=>{

		//console.log(req.body);
		
		read(path,(err,data)=>{
			
			data=data.length?JSON.parse(data):[];
			data.push(req.body);

			write(path,JSON.stringify(data),(err)=>{
				res.end();
			});
		});
});

app.post('/photo',upload.single('picture'),(req,res)=>{
	//console.log(req.file);
	res.send(req.file);
});

app.delete('/del',(req,res)=>{
	
	read(path,(err,data)=>{
		if(err)
			res.end('<h1>Oops! Something went wrong...</h1>');
		else
		{
			data=JSON.parse(data);
			let index=data.findIndex(val=>{
				return req.body.id==val.id;
			});

			let temp=data[index];

			data.splice(index,1);
			
			write('data.txt',JSON.stringify(data),(err)=>{
				console.log('Data Deleted!');
				res.end(JSON.stringify(temp));
			})
		}
	})
})

app.post('/status',(req,res)=>{
	
	read(path,(err,data)=>{

		data = JSON.parse(data);

		let value=data.find(val=>{
			return req.body.id==val.id;
		});
		
		let temp=value;
		value.check=(value.check===true)?false:true;

		write(path,JSON.stringify(data),(err)=>{
			console.log('Task Status Updated!');
			res.end(JSON.stringify(temp));
		})

	})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

const read=(path,callback)=>{
	fs.readFile(path,'utf-8',(err,data)=>{
		callback(err,data);
	});
}

const write=(path,data,callback)=>{
	fs.writeFile(path,data,(err)=>{
		callback(err);
	})
};