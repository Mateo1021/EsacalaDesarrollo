let data = []; //Todas las preguntas
let questionResponse = [];
let complete_data = []

function loadData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(axios.get('https://my-json-server.typicode.com/Mateo1021/json/Questions'));
    }, 1000);
  });
}
async function mostrarInfo(){
  let initial_item = 13;
  const result = await loadData();
  let datos = Object.values(result.data);

  let pregunta = datos.find(x => x.item === initial_item);

  let completeData = []
  let d = []

  for (let index = 0; index <= result.data.length - 1; index++) {
      const element = result.data[index];      
      element["response"] = false
      element["isResponse"] = false
      if (d.length == 0) {
        d.push(element)
      }
      
      if (d[d.length - 1]["age_range"] == element["age_range"]) {
        if (!(d[d.length - 1] == element)) {
            d.push(element)
        }
      } else {
        completeData.push({
            isRangeComplete: 0,
            data: d
        })
        d = []
        d.push(element)
      }

      if (index == result.data.length - 1) {
          completeData.push({
            isRangeComplete: 0,
            data: d
        })
      }
  }
  complete_data = completeData
  data = datos;
  document.getElementById('pregunta').value = pregunta.question;
  document.getElementById('valor').value = pregunta.age_range - 1 + "," + complete_data[pregunta.age_range - 1].data.indexOf(pregunta);
  console.log(complete_data)
}
function selectItem(padre, hijo){
    busqueda = complete_data[padre].data[hijo]
    console.log(busqueda.question);
    document.getElementById('pregunta').value = ' ';
    document.getElementById('pregunta').value = busqueda.question;
    document.getElementById('valor').value = busqueda.age_range - 1 + "," + complete_data[busqueda.age_range - 1].data.indexOf(busqueda);
    return busqueda.isResponse
}
function respuesta(resp) {
    let respuesta = resp;
    let item = document.getElementById("valor").value;
    let txtPreg = document.getElementById('pregunta').value;
    let completeIndex = item.split(",").map(e=>parseInt(e))
    complete_data[completeIndex[0]].data[completeIndex[1]].isResponse = true
    complete_data[completeIndex[0]].data[completeIndex[1]].response = resp
    questionResponse.push(
        {
        'txtPreg': txtPreg,
        'respuesta': respuesta,
        'item': complete_data[completeIndex[0]].data[completeIndex[1]].item
        }
    );
    setTimeout(function(){ evRes(completeIndex[0], completeIndex[1]); }, 100);
}
let puntoI = false;
let parentI = 0
let childI = 0
function evRes(parentInd, childInd){
    let parent = complete_data[parentInd]
    let finalParentPosition = complete_data[complete_data.length - 1]
    if ((finalParentPosition == parent) && (finalParentPosition.data[finalParentPosition.data.length - 1].isResponse)) {
        alert("Se finalizo el cuestionario")
        return
    }
    if(parentInd == 0 ){
      if(childInd ==0){
        if(complete_data[parentInd].data[childInd].response){
          selectItem(parentInd,childInd+1)
        }else if(!complete_data[parentInd].data[childInd].response){
          selectItem(parentInd,childInd+1)
        }
      }
      if(childInd ==1){
        if(complete_data[parentInd].data[childInd].response){
          selectItem(parentInd,childInd+1)
        }else if(!complete_data[parentInd].data[childInd].response){
          if(!complete_data[parentInd].data[childInd-1].response){
            alert('no esta listo')
          }else{
            selectItem(parentInd,childInd+1)
          }
        } 
      }
      if(childInd ==2){
        if(complete_data[parentInd].data[childInd].response){
          selectItem(parentInd+1,childInd-2)
        }else if(!complete_data[parentInd].data[childInd].response){
          if(!complete_data[parentInd].data[childInd-1].response){
            alert('no esta listo')
          }else{
            selectItem(parentInd+1,childInd-2)
          }
        }  
      }
      return
    }
    if(childInd == 0){
      if(complete_data[parentInd].data[childInd].response){
        if(complete_data[parentInd].data[childInd+1].isResponse && complete_data[parentInd].data[childInd+1].response){
          selectItem(parentInd+1,childInd+2)
        }else{
        selectItem(parentInd,childInd+1)}
      }else if (!complete_data[parentInd].data[childInd].response){
        if(complete_data[parentInd-1].data[childInd+2].isResponse){
          if(!complete_data[parentInd-1].data[childInd+2].response){
          alert('punto de cierre')
         return 
        }
      }
        if(complete_data[parentInd-1].data[childInd+2].isResponse && complete_data[parentInd-1].data[childInd+2].response){
          selectItem(parentInd,childInd+1)
        }else{
          selectItem(parentInd-1,childInd+2)
          if(!puntoI){
            parentI = parentInd
            childI = childInd
            puntoI = true
           }
        }
      }
    }
    if(childInd == 1){
      if(complete_data[parentInd].data[childInd].response){
        if(complete_data[parentInd].data[childInd+1].isResponse && complete_data[parentInd].data[childInd+1].response){
          puntoI ? selectItem(parentI,childI+1) : selectItem(parentInd+1,childInd)
      }else{selectItem(parentInd,childInd+1)}
      }else if(!complete_data[parentInd].data[childInd].response){
        if(complete_data[parentInd].data[childInd-1].isResponse){
          if(!complete_data[parentInd].data[childInd-1].response){
            alert('punto de Cierre')
          }else{       
            if(!puntoI){
             parentI = parentInd
             childI = childInd
             puntoI = true
            }
            selectItem(parentInd-1,childInd+1)
          }
        }
      }
      if(complete_data[parentInd].data[childInd+1].isResponse && !complete_data[parentInd].data[childInd+1].response) {
        selectItem(parentInd,childInd-1)
      }
      if(!complete_data[parentInd].data[childInd+1].isResponse){
        selectItem(parentInd,childInd+1)
        return
      }
    }
    if(childInd == 2){
      if(complete_data[parentInd].data[childInd].response){
        if(complete_data[parentInd+1].data[childInd-2].response){
          selectItem(parentInd+1,childInd)
        }else if(!complete_data[parentInd+1].data[childInd-2].isResponse){
          selectItem(parentInd+1,childInd-2)
        }
        if(complete_data[parentInd+1].data[childInd-2].isResponse && !complete_data[parentInd+1].data[childInd-2].response){
          selectItem(parentInd,childInd-1)
        }
      }else if(!complete_data[parentInd].data[childInd].response){
        if(complete_data[parentInd+1].data[childInd-2].isResponse){
          selectItem(parentInd,childInd-1)
          return
        }
        if(complete_data[parentInd].data[childInd-1].response){
          selectItem(parentInd+1,childInd-2)
         return 
        }
        if(!complete_data[parentInd-1].data[childInd].response || !complete_data[parentInd].data[childInd-1].response){
          alert('se llego al punto de cierre')
        }
      }
    }
}