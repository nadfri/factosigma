'use strict';

const max = 59000;
const factoSpan = document.getElementById('factoSpan');
const decomposition = document.getElementById('decomposition');
const somme = document.getElementById('somme');
const downBtn = document.getElementById('downBtn');
const startbtn = document.getElementById('startbtn');
const containerGraph = document.getElementById('container-graph');

const n = document.getElementById('n');
n.placeholder = `Max:${max}`;
n.focus();

/*Sigma function*/
function sigma(n, q) {
  let s = 0;
  const N = n;

  do {
    s += n % q;
    n = Math.trunc(n / q);
  } while (n != 0);
  return (N - s) / (q - 1);
}

/*S function*/
function s(n, q) {
  let s = 0;
  const N = n;

  do {
    s += n % q;
    n = Math.trunc(n / q);
  } while (n != 0);
  return s;
}

/*Factorial function */
function factoriel(n) {
  const MAX = 170;

  if (n > MAX) return Infinity;
  else {
    if (n == 1 || n == '' || n == 0) return 1;
    else return n * factoriel(n - 1);
  }
}

/*Get Occurence of sigma*/
function getOccurenceSigma(arrayOfPrimeAndSigmaValue) {
  const occurrencesSigmaObj = {};

  for (const [_, sigma] of arrayOfPrimeAndSigmaValue) {
    if (occurrencesSigmaObj[sigma]) {
      occurrencesSigmaObj[sigma] += 1;
    } else {
      occurrencesSigmaObj[sigma] = 1;
    }
  }

  const arrayOfOccurenceSigma = Object.entries(occurrencesSigmaObj)
    .filter(([_, occurrencesSigmaObj]) => occurrencesSigmaObj > 1)
    .map(([value, occurrence]) => [Number(value), occurrence]);

  console.log('occurence of Sigma:', arrayOfOccurenceSigma);

  return arrayOfOccurenceSigma;
}

n.oninput = () => {
  const arrayOfSigmas = [];
  const arrayOfPrimeAndSigmaValue = [];
  const arrayOfPrimeAndBase = [];

  if (n.value > max) {
    decomposition.innerHTML = `<i>Erreur: n > ${max} !!!</i>`;
    factoSpan.innerHTML = '<i>Choisir un n plus petit!</i>';
  } else {
    factoSpan.textContent = factoriel(n.value).toLocaleString();
    decomposition.innerHTML = '';
    somme.innerHTML = '';

    let excelP = 'p:\n';
    let excelSG = '\nSigma:\n';

    for (let prime of primes) {
      if (prime > n.value) break;
      else {
        const sigmaValue = sigma(n.value, prime);
        const base = s(n.value, prime);
        arrayOfSigmas.push({ prime, sigmaValue });

        const spanSigma = document.createElement('span');
        spanSigma.innerHTML = `${prime}<sup>${sigmaValue}</sup> *`;
        decomposition.appendChild(spanSigma);

        const spanS = document.createElement('span');
        spanS.innerHTML = `${prime}<sub>${base}</sub> *`;
        somme.appendChild(spanS);

        arrayOfPrimeAndBase.push([prime, base]);
        arrayOfPrimeAndSigmaValue.push([prime, sigmaValue]);

        excelP += prime + '\n';
        excelSG += sigmaValue + '\n';
      }
    }

    const arrayOfOccurenceSigma = getOccurenceSigma(arrayOfPrimeAndSigmaValue);

    trace(arrayOfPrimeAndSigmaValue, arrayOfPrimeAndBase, arrayOfOccurenceSigma);
    downBtn.disabled = n.value > 0 ? false : true;
  }
};

/* Graphique */
function trace(data1, data2, data3) {
  //Supprime les SVG existants pour la création de deux nouveaux
  document.getElementById('courbe1')?.remove();
  document.getElementById('courbe2')?.remove();
  document.getElementById('courbe3')?.remove();

  const svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg1.id = 'courbe1';
  containerGraph.appendChild(svg1);

  const svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg2.id = 'courbe2';
  containerGraph.appendChild(svg2);

  const svg3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg3.id = 'courbe3';
  containerGraph.appendChild(svg3);

  const graphSigma = new jsGraphDisplay();

  data1.splice(0, 1);

  graphSigma.DataAdd({
    title: 'arrayOfPrimeAndSigmaValue',
    data: data1,
  });

  graphSigma.axe.x.title = 'Prime';
  graphSigma.axe.y.title = 'Sigma';
  graphSigma.axe.y.max = 20;
  graphSigma.axe.y.step = 1;
  graphSigma.Draw(svg1.id);

  const graphBase = new jsGraphDisplay();

  graphBase.DataAdd({
    title: 'arrayOfPrimeAndBase',
    data: data2,
    display: {
      linkColor: '#0000ff',
    },
  });

  graphBase.axe.x.title = 'Prime';
  graphBase.axe.y.title = 'Base';
  graphBase.Draw(svg2.id);

  const graphOccSigma = new jsGraphDisplay();

  graphOccSigma.DataAdd({
    title: 'arrayOfOccurenceSigma',
    data: data3,
    display: {
      linkColor: '#b600ff',
    },
  });

  graphOccSigma.axe.x.title = 'Sigma';
  graphOccSigma.axe.y.title = 'Occurrence of Sigma > 1';
  graphOccSigma.Draw(svg3.id);
}

/* Animation */
let start = true;
let animation;
let step = 2;

startbtn.onclick = () => {
  if (start == true) {
    animation = requestAnimationFrame(motion);
    start = false;
    startbtn.textContent = "Stopper l'animation";
  } else {
    cancelAnimationFrame(animation);
    start = true;
    startbtn.textContent = "Reprendre l'animation";
  }
};

function motion() {
  const arrayOfPrimeAndSigmaValue = [];
  const arrayOfPrimeAndBase = [];

  for (let prime of primes) {
    if (prime > step) break;

    const sigmaValue = sigma(step, prime);
    let base = s(step, prime);

    arrayOfPrimeAndSigmaValue.push([prime, sigmaValue]);
    arrayOfPrimeAndBase.push([prime, base]);
  }

  const arrayOfOccurenceSigma = getOccurenceSigma(arrayOfPrimeAndSigmaValue);

  trace(arrayOfPrimeAndSigmaValue, arrayOfPrimeAndBase, arrayOfOccurenceSigma);
  step++;
  animation = requestAnimationFrame(motion); //allow start animation
}

/*Download Handler*/
document.getElementById('downBtn').addEventListener(
  'click',
  function () {
    // Generate download of hello.txt file with some content
    const text = excelP + excelSG;
    const filename = 'sigma.txt';

    download(filename, text);
  },
  false
);

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/************Permettre le 100vh sur mobile */
const vh = window.innerHeight * 0.01;
const hauteur = window.innerHeight;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

//Empeche le resizing à l'apparition du clavier
const metas = document.getElementsByTagName('meta');
metas[1].content =
  'width=device-width, height=' +
  window.innerHeight +
  ' initial-scale=1.0, maximum-scale=5.0,user-scalable=0';
