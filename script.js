'use strict';

const max = 59000;
const factoSpan = document.getElementById('factoSpan');
const decomposition = document.getElementById('decomposition');
const somme = document.getElementById('somme');
const downBtn = document.getElementById('downBtn');
const startbtn = document.getElementById('startbtn');
const containerGraph = document.getElementById('container-graph');
let excelP = '';
let excelSigma = '';
let excelSnp = '';

const n = document.getElementById('n');
n.placeholder = `Max:${max}`;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    n.value = Number(n.value) + 1;
    n.dispatchEvent(new Event('input'));
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (n.value > 0) {
      n.value = Number(n.value) - 1;
      n.dispatchEvent(new Event('input'));
    }
  }
});

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
function s(n, p) {
  const N = n;
  let s = 0;

  do {
    s += n % p;
    n = Math.trunc(n / p);
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

  return arrayOfOccurenceSigma;
}

n.oninput = () => {
  const arrayOfSigmas = [];
  const arrayOfPrimeAndSigmaValue = [];
  const arrayOfPrimeAndBase = [];

  if (n.value > max) {
    decomposition.innerHTML = `<i>Erreur: n > ${max} !!!</i>`;
    factoSpan.innerHTML = '<i>Choisir un n plus petit!</i>';
  } else if (n.value < 0) {
    decomposition.innerHTML = `<i>Erreur: n < 0 !!!</i>`;
    factoSpan.innerHTML = '<i>Choisir un n positif!</i>';
  } else {
    factoSpan.textContent = factoriel(n.value).toLocaleString();
    decomposition.innerHTML = '';
    somme.innerHTML = '';

    excelP = 'p= [';
    excelSnp = ']\nSnp= [';
    excelSigma = ']\nSigma= [';

    for (let prime of primes) {
      if (prime > n.value) break;
      else {
        const sigmaValue = sigma(n.value, prime);
        const base = s(n.value, prime);
        arrayOfSigmas.push({ prime, sigmaValue });

        const spanStar = document.createElement('span');
        spanStar.textContent = ' * ';

        const spanSigma = document.createElement('span');
        spanSigma.innerHTML = `${prime}<sup>${sigmaValue}</sup>`;

        decomposition.appendChild(spanSigma);
        decomposition.appendChild(spanStar.cloneNode(true)); // allow clonage of spanStar

        const spanS = document.createElement('span');
        spanS.innerHTML = `${prime}<sub>${base}</sub>`;

        somme.appendChild(spanS);
        somme.appendChild(spanStar.cloneNode(true)); // allow clonage of spanStar

        arrayOfPrimeAndBase.push([prime, base]);
        arrayOfPrimeAndSigmaValue.push([prime, sigmaValue]);

        excelP += prime + ',';
        excelSigma += sigmaValue + ',';
        excelSnp += base + ',';
      }
    }

    //remove last * from decomposition and somme of last span
    decomposition.lastChild?.remove();
    somme.lastChild?.remove();

    const arrayOfOccurenceSigma = getOccurenceSigma(arrayOfPrimeAndSigmaValue);

    trace(arrayOfPrimeAndBase, arrayOfPrimeAndSigmaValue, arrayOfOccurenceSigma);

    downBtn.disabled = n.value > 0 ? false : true;
  }
};

/* Graphique */
let courbe_snp;
let courbe_occurence_sigma;

function trace(data1, data2, data3) {
  if (typeof courbe_snp !== 'undefined') {
    courbe_snp.destroy();
    courbe_occurence_sigma.destroy();
  }

  const chart_snp = document.getElementById('chart_snp');
  const chart_occurence_sigma = document.getElementById('chart_occurence_sigma');

  const commonOptions = {
    responsive: true,
    animation: false,
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
  };

  courbe_snp = new Chart(chart_snp, {
    type: 'line',
    data: {
      labels: data1.map(([prime, _]) => prime),
      datasets: [
        {
          label: 'S(n,p)',
          data: data1.map(([_, y]) => y),
          borderWidth: 1,
          yAxisID: 'y-snp',
        },
        {
          label: 'Sigma(n,p)',
          data: data2.map(([_, y]) => y),
          borderWidth: 1,
          yAxisID: 'y-sigma',
        },
      ],
    },
    options: {
      ...commonOptions,
      scales: {
        x: {
          min: 2,
          type: 'linear',
          display: true,
          title: {
            display: true,
            text: 'Prime',
          },
          ticks: {
            stepSize: 1,
            precision: 0,
          },
        },
        'y-snp': {
          min: 0,
          display: true,
          position: 'left', // Afficher l'axe à gauche pour S(n,p)
          title: {
            display: true,
            text: 'S(n,p)',
          },
          ticks: {
            stepSize: 1,
            precision: 0,
          },
        },
        'y-sigma': {
          min: 0,
          max: 15,
          display: true,
          position: 'right', // Afficher l'axe à droite pour Sigma(n,p)
          title: {
            display: true,
            text: 'Sigma(n,p)',
          },
          ticks: {
            stepSize: 1,
            precision: 0,
          },
          grid: {
            display: false, // Masquer le quadrillage de l'axe y de droite
          },
        },
      },
    },
  });

  courbe_occurence_sigma = new Chart(chart_occurence_sigma, {
    type: 'bar',
    data: {
      labels: data3.map(([prime, _]) => prime),
      datasets: [
        {
          label: 'Occurence de Sigma(n,p)',
          data: data3.map(([_, y]) => y),
          borderWidth: 1,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
        },
      ],
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: {
          min: 1,
          display: true,
          title: {
            display: true,
            text: 'Sigma(n,p)',
          },
          ticks: {
            stepSize: 1,
            precision: 0,
          },
        },
        y: {
          min: 0,
          display: true,
          title: {
            display: true,
            text: 'Occurence de Sigma(n,p) > 1',
          },
          ticks: {
            stepSize: 1,
            precision: 0,
          },
        },
      },
    },
  });
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

  trace(arrayOfPrimeAndBase, arrayOfPrimeAndSigmaValue, arrayOfOccurenceSigma);
  step++;
  animation = requestAnimationFrame(motion); //allow start animation
}

/*Download Handler*/
document.getElementById('downBtn').addEventListener(
  'click',
  function () {
    // Generate download of hello.txt file with some content
    const text = excelP + excelSnp + excelSigma + ']';
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
