n.focus();

const primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101];
let tabSigma;


n.oninput = () => {
    factoSpan.textContent   = factoriel(n.value);
    decomposition.innerHTML = "";
    tabSigma  = [];

    if(!primes.includes(Number(n.value)) && n.value != "" && n.value != 1)
        decomposition.textContent = `${n.value} n'est pas un nombre premier!`;

    else
    {
    
    for (let prime of primes)
    {
        if(prime>=n.value) break;

        else 
        {
            let sigmaValue = sigma(n.value,prime);
            tabSigma.push({prime,sigmaValue});
        }
    }

    for (let p of tabSigma)
    {
        decomposition.innerHTML += `${p.prime}<sup>${p.sigmaValue}</sup> * `;
    }

    decomposition.innerHTML += n.value + "<sup>1</sup>";

    decomposition.innerHTML = (decomposition.innerHTML == "<sup>1</sup>")?
    "" : decomposition.innerHTML; //vide vraiment la div
}  
};

function factoriel(n)
{
    if (n == 1 || n == "" || n == 0) return 1;
    else return (n * factoriel(n - 1));
}

function sigma(n,p)
{
    let s = 0;
    const N = n;

    if(n == "")
        return false;
    else
    {
        do
        {
            s += n%p;
            n  = Math.trunc(n/p);
        }while(n != 0)

        return (N-s)/(p-1);
    }
}

