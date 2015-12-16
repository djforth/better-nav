var  exec = require('child_process').exec

function puts(error, stdout, stderr) {
  if(error){
    console.warn("error", error)

  } else {
    console.log("killed")
  }
}

// console.log("WTF?", exec)
exec("./bin/kill.sh", puts);
