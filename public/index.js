const button = document.querySelector('#button');
const ul = document.querySelector('#tasklist');
const error=document.createElement('p');
const form = document.querySelector('form');
const input=document.querySelector('input[type=text]');
const imgfile=document.querySelector('input[type=file]');

form.addEventListener('submit',(event)=>{

    event.preventDefault();
    const data = new FormData(event.target);
    const filename = data.get('picture');
  
    if(filename.type!=='image/png' && filename.type!=='image/jpg' && filename.type!=='image/jpeg')
    {
      alert('File type not allowed')
      input.value='';
      imgfile.value='';
    }
    else
    {

      let ID = Date.now();
      const obj={
          id:ID,
          itemName:input.value,
          file:null, 
          check:false
      };
      
      //sendRequest(JSON.stringify(obj));
      
      const req=new XMLHttpRequest();
      req.open('POST','/photo');
      req.send(data);
      req.addEventListener('load',()=>{
         
          console.log(req.responseText);
          const data=JSON.parse(req.responseText);
          obj.file=data.filename;
          createTask(obj);
          sendRequest(JSON.stringify(obj)); 
      });

      // emptying text field & file value
      input.value='';
      imgfile.value='';
    }
});

const sendRequest = (data)=>{
    
    const request = new XMLHttpRequest();
    request.open('POST','/save');
    
    request.setRequestHeader('Content-Type','application/json');
    request.send(data);

}

const createTask=(obj)=>{

    const li = document.createElement('li');
    const p = document.createElement('p');
    const div = document.createElement('div');
    const img = document.createElement('img');
    const input = document.createElement('input');
    const i = document.createElement('i');

    // setting attributes
    
    li.setAttribute('id','del'+obj.id);
    p.appendChild(document.createTextNode(obj.itemName));
    p.setAttribute('class','fs-2');
    p.setAttribute('id',`li${obj.id}`);
    div.classList.add('box');
    img.setAttribute('alt','Failed To Load...');
    //img.setAttribute('src',obj.file.name);
    img.setAttribute('src',obj.file);
    input.setAttribute('type','checkbox');
    input.setAttribute('id',`${obj.id}li`);
    i.setAttribute('class','glyphicon glyphicon-trash');
    i.setAttribute('style','font-size:24px;color:red; flex: 33%;');

    if(obj.check===true)
    {
      p.style.textDecoration='line-through';
      input.checked=true;
    }

    // appending elements
    div.appendChild(img);
    div.appendChild(input);
    div.appendChild(i);

    li.appendChild(p);
    li.appendChild(div);
    
    ul.appendChild(li);
    ul.appendChild(document.createElement('hr'));

    input.addEventListener('change',()=>{
        checkItem(obj.id);
    })

    i.addEventListener('click',()=>{
        deleteItem(obj.id);
    })
}

const show=()=>{
  let html='';  
  var request = new XMLHttpRequest();
  request.open('GET','/todo');
  request.send();
  request.addEventListener('load',()=>{
      let data= JSON.parse(request.responseText);
      data.forEach(value=>{
          createTask(value); 
      });  
  })  
}
show();

const deleteItem=(index)=>{

  const request = new XMLHttpRequest();
      
  request.open("DELETE","/del");
  request.setRequestHeader("Content-type","application/json");

  request.send(JSON.stringify({id:index}));

  request.addEventListener("load", function()
  {
    let response=JSON.parse(request.responseText);
    var li=document.getElementById(`del${response.id}`);
    var hr=li.nextSibling;
    ul.removeChild(li);
    ul.removeChild(hr);

  }); 	
}

const checkItem= (index) =>{
  
  const request = new XMLHttpRequest();
  request.open("POST","/status");
  request.setRequestHeader("Content-type","application/json");

  request.send(JSON.stringify({id:index}));

  request.addEventListener('load',()=>{
    let val=JSON.parse(request.responseText);
    //console.log(val.check);
    var checkBox=document.getElementById(val.id+'li');
    var p=document.getElementById('li'+val.id);
    p.style.textDecoration=(checkBox.checked===true)?"line-through":"none";
  
  });

}