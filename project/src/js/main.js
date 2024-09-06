 document.addEventListener('DOMContentLoaded', function(){
  console.log('Hello, World!');

  let fahrToCelsius = (fahr) => {
    return (fahr - 32) * (5 / 9);
  };

  console.log(fahrToCelsius(0));
 });
