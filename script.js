// Get references to HTML elements
const numbersInput = document.getElementById('numbersInput');
const submitBtn = document.getElementById('submitBtn');
const arrayContainer = document.getElementById('arrayContainer');
const sortBtn = document.getElementById('sortBtn');
const searchBtn = document.getElementById('searchBtn');
const algorithmSelect = document.getElementById('algorithmSelect');
const searchAlgorithmSelect = document.getElementById('searchAlgorithmSelect');
const actionDisplay = document.getElementById('actionDisplay');
const stepsDisplay = document.getElementById('stepsDisplay');
const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');
const resetBtn = document.getElementById('resetBtn');
const clearSearchedElement = document.getElementById('clearSearchedElement');

let numbers = [];

// Event listener for the submit button
submitBtn.addEventListener('click', () => {
    stepsDisplay.innerHTML = ""; // Clear previous steps
    const input = numbersInput.value.trim();
    numbers = input.split(' ').map(Number).filter(num => !isNaN(num)).slice(0, 10); // Limit to 10 numbers
    renderArray();
});

// Event listener for sorting button
sortBtn.addEventListener('click', () => {
    const algorithm = algorithmSelect.value;
    actionDisplay.textContent = `Sorting using ${algorithm}...`;
    stepsDisplay.innerHTML = ""; // Clear previous steps
    switch (algorithm) {
        case 'bubble':
            bubbleSort(numbers);
            break;
        case 'selection':
            selectionSort(numbers);
            break;
        case 'insertion':
            insertionSort(numbers);
            break;
        case 'merge':
            mergeSort(numbers);
            break;
        case 'quick':
            quickSort(numbers);
            break;
        default:
            alert("Invalid sorting algorithm selected.");
    }
});

// Event listener for searching button
searchBtn.addEventListener('click', () => {
    const searchAlgorithm = searchAlgorithmSelect.value;
    const searchValue = parseInt(prompt("Enter number to search:"));
    if (isNaN(searchValue)) {
        alert("Please enter a valid number.");
        return;
    }

    actionDisplay.textContent = `Searching for ${searchValue} using ${searchAlgorithm}...`;
    stepsDisplay.innerHTML = ""; // Clear previous steps
    switch (searchAlgorithm) {
        case 'linear':
            linearSearch(numbers, searchValue);
            break;
        case 'binary':
            binarySearch(numbers, searchValue);
            break;
        default:
            alert("Invalid search algorithm selected.");
    }
});

// Event listener for reset button
resetBtn.addEventListener('click', () => {
    numbersInput.value = '';
    arrayContainer.innerHTML = '';
    actionDisplay.textContent = 'Actions will be displayed here...';
    stepsDisplay.innerHTML = '';
    numbers = [];
});

// Event listener for clear searched element button
clearSearchedElement.addEventListener('click', () => {
    const bars = document.querySelectorAll('.array-bar.success');
    bars.forEach(bar => {
        bar.classList.remove('success');
    });
});

// Event listener for speed range adjustment
speedRange.addEventListener('input', () => {
    speedValue.textContent = `${speedRange.value} ms`;
});

document.getElementById('saveSteps').addEventListener('click', () => {
    const steps = document.getElementById('stepsDisplay').innerHTML;
    const blob = new Blob([steps], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'steps.txt';
    a.click();
  });
// Render the array in bars
function renderArray() {
    arrayContainer.innerHTML = ''; // Clear previous bars
    numbers.forEach((num, index) => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${num * 3}px`; // Adjust height based on number
        bar.innerHTML = `<span>${num}</span>`;
        arrayContainer.appendChild(bar);
    });
}

// Sorting Algorithms
async function bubbleSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                await swap(arr, j, j + 1);
            }
            updateSteps(`Bubble Sort: Comparing ${arr[j]} and ${arr[j + 1]}`);
        }
    }
    renderArray();
}

async function selectionSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
            updateSteps(`Selection Sort: Comparing ${arr[i]} and ${arr[j]}`);
        }
        await swap(arr, i, minIndex);
    }
    renderArray();
}

async function insertionSort(arr) {
    const len = arr.length;
    for (let i = 1; i < len; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
            updateSteps(`Insertion Sort: Moving ${arr[j + 1]} to the right`);
            renderArray(); // Update the array display
            await new Promise(resolve => setTimeout(resolve, speedRange.value));
        }
        arr[j + 1] = key;
        renderArray(); // Update the array display
        await new Promise(resolve => setTimeout(resolve, speedRange.value));
    }
    renderArray();
}
async function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = await mergeSort(arr.slice(0, mid));
    const right = await mergeSort(arr.slice(mid));
    return await merge(left, right);
}

async function merge(left, right) {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
        numbers = result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
        renderArray(); // Update the array display
        updateSteps(`Merge Sort: Merging ${left[leftIndex - 1] || ''} and ${right[rightIndex - 1] || ''}`);
        await new Promise(resolve => setTimeout(resolve, speedRange.value));
    }
    numbers = result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    renderArray(); // Update the array display
    await new Promise(resolve => setTimeout(resolve, speedRange.value));
    return numbers;
}

async function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
        updateSteps(`Quick Sort: Comparing ${arr[i]} with pivot ${pivot}`);
        numbers = [...left, pivot, ...right];
        renderArray(); // Update the array display
        await new Promise(resolve => setTimeout(resolve, speedRange.value));
    }
    numbers = [...await quickSort(left), pivot, ...await quickSort(right)];
    renderArray(); // Update the array display
    await new Promise(resolve => setTimeout(resolve, speedRange.value));
    return numbers;
}

// Searching Algorithms
async function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        updateSteps(`Linear Search: Checking ${arr[i]}`);
        if (arr[i] === target) {
            document.querySelectorAll('.array-bar')[i].classList.add('success');
            actionDisplay.textContent = `${target} found at index ${i}!`;
            return;
        }
        await new Promise(resolve => setTimeout(resolve, speedRange.value));
    }
    actionDisplay.textContent = `${target} not found!`;
}

async function binarySearch(arr, target) {
    // Check if the array is already sorted
    if (!isSorted(arr)) {
        arr.sort((a, b) => a - b);
        renderArray(); // Update the array display
    }

    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        updateSteps(`Binary Search: Checking ${arr[mid]}`);
        if (arr[mid] === target) {
            document.querySelectorAll('.array-bar')[mid].classList.add('success');
            actionDisplay.textContent = `${target} found at index ${mid}!`;
            return;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
        await new Promise(resolve => setTimeout(resolve, speedRange.value));
    }
    actionDisplay.textContent = `${target} not found!`;
}

// Function to check if the array is sorted
function isSorted(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}

// Swap function for sorting algorithms
async function swap(arr, i, j) {
    const bars = document.querySelectorAll('.array-bar');
    const heightI = arr[i] * 3;
    const heightJ = arr[j] * 3;

    // Animation effect
    bars[i].style.height = `${heightJ}px`;
    bars[j].style.height = `${heightI}px`;

    // Swap the elements in the array
    [arr[i], arr[j]] = [arr[j], arr[i]];
    await new Promise(resolve => setTimeout(resolve, speedRange.value));
}

// Update steps display
// Update steps display
function updateSteps(step) {
    const stepElement = document.createElement('div');
    stepElement.textContent = step;
    stepsDisplay.appendChild(stepElement);
}

// Render the initial state
function renderArray() {
    arrayContainer.innerHTML = ''; // Clear previous bars
    numbers.forEach((num, index) => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${num * 3}px`; // Adjust height based on number
        bar.innerHTML = `<span>${num}</span>`;
        arrayContainer.appendChild(bar);
    });
}

document.getElementById('saveSteps').addEventListener('click', () => {
    const steps = document.getElementById('stepsDisplay').innerHTML;
    const blob = new Blob([steps], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'steps.txt';
    a.click();
  });