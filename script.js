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
    
    // Check if the input is empty or contains non-numeric values
    if (!input || !/^\d+( \d+)*$/.test(input)) {
        alert("Please enter a valid list of numbers.");
        return;
    }

    numbers = input.split(' ').map(Number); // Convert input into an array of numbers
    
    // Limit the numbers to be <= 103
    numbers = numbers.filter(num => num <= 103);

    if (numbers.length === 0) {
        alert("No valid numbers entered. ");
        return;
    }

    renderArray(); // Render the array after filtering
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
    let isSortedFlag = true;

    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            updateSteps(`Bubble Sort: Comparing ${arr[j]} and ${arr[j + 1]}`);
            
            if (arr[j] > arr[j + 1]) {
                isSortedFlag = false;
                await swap(arr, j, j + 1);
                updateSteps(`Bubble Sort: Swapping ${arr[j]} and ${arr[j + 1]}`, `${arr[j]} ↔ ${arr[j + 1]}`, `Comparison: ${arr[j]} > ${arr[j + 1]}`);
            } else {
                updateSteps(`Bubble Sort: No swap needed for ${arr[j]} and ${arr[j + 1]}`, '', `Comparison: ${arr[j]} <= ${arr[j + 1]}`);
            }
        }
        renderArray();
    }

    updateSteps(`Bubble Sort: Finished. Array is sorted.`, '', '', isSortedFlag);
}



async function selectionSort(arr) {
    const len = arr.length;
    let isSortedFlag = true;

    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            updateSteps(`Selection Sort: Comparing ${arr[i]} and ${arr[j]}`);
            
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
                updateSteps(`Selection Sort: Found new minimum ${arr[minIndex]} at index ${minIndex}`, '', `Comparison: ${arr[i]} > ${arr[j]}`);
            } else {
                updateSteps(`Selection Sort: No new minimum found`, '', `Comparison: ${arr[i]} <= ${arr[j]}`);
            }
        }

        if (minIndex !== i) {
            await swap(arr, i, minIndex);
            updateSteps(`Selection Sort: Swapping ${arr[i]} and ${arr[minIndex]}`, `${arr[i]} ↔ ${arr[minIndex]}`, `Comparison: ${arr[i]} > ${arr[minIndex]}`);
        }

        renderArray();
    }

    updateSteps(`Selection Sort: Finished. Array is sorted.`, '', '', isSortedFlag);
}



async function insertionSort(arr) {
    const len = arr.length;
    let isSortedFlag = true;

    for (let i = 1; i < len; i++) {
        let key = arr[i];
        let j = i - 1;
        updateSteps(`Insertion Sort: Key = ${key}`);

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
            updateSteps(`Insertion Sort: Moving ${arr[j + 1]} to the right`, '', `Comparison: ${arr[j + 1]} > ${key}`);
            renderArray(); // Update the array display
            await new Promise(resolve => setTimeout(resolve, speedRange.value));
        }

        arr[j + 1] = key;
        renderArray(); // Update the array display
        await new Promise(resolve => setTimeout(resolve, speedRange.value));
    }

    updateSteps(`Insertion Sort: Finished. Array is sorted.`, '', '', isSortedFlag);
}


async function mergeSort(array, left = 0, right = array.length - 1) {
    if (left >= right) {
        return; // Base case: single element
    }

    const mid = Math.floor((left + right) / 2);
    
    // Render the current state of the array after splitting
    renderArray();
    updateSteps(`Splitting: Left [${array.slice(left, mid + 1)}], Right [${array.slice(mid + 1, right + 1)}]`);
    
    // Add a slight delay for visualization
    await new Promise(resolve => setTimeout(resolve, speedRange.value));

    // Recursively sort both halves
    await mergeSort(array, left, mid);
    await mergeSort(array, mid + 1, right);

    // Merge the sorted halves
    await merge(array, left, mid, right);
    
    // Log the merge completion and update array display
    renderArray();
    updateSteps(`Merge Completed: [${array.slice(left, right + 1)}]`);
}

async function merge(array, left, mid, right) {
    let n1 = mid - left + 1;
    let n2 = right - mid;

    let leftArray = new Array(n1);
    let rightArray = new Array(n2);

    // Copy data to temp arrays leftArray[] and rightArray[]
    for (let i = 0; i < n1; i++) {
        leftArray[i] = array[left + i];
    }
    for (let i = 0; i < n2; i++) {
        rightArray[i] = array[mid + 1 + i];
    }

    // Render the current left and right arrays
    renderArray();
    updateSteps(`Merging Left [${leftArray}] and Right [${rightArray}]`);
    
    // Add a slight delay for visualization
    await new Promise(resolve => setTimeout(resolve, speedRange.value));

    let i = 0, j = 0, k = left;

    // Merge the temp arrays back into the main array
    while (i < n1 && j < n2) {
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            updateSteps(`Inserting ${leftArray[i]} from Left Array into position ${k} in the main array`);
            i++;
        } else {
            array[k] = rightArray[j];
            updateSteps(`Inserting ${rightArray[j]} from Right Array into position ${k} in the main array`);
            j++;
        }
        renderArray(); // Update the array display
        await new Promise(resolve => setTimeout(resolve, speedRange.value)); // Animation delay
        k++;
    }

    // Copy any remaining elements of leftArray[], if any
    while (i < n1) {
        array[k] = leftArray[i];
        updateSteps(`Inserting remaining ${leftArray[i]} from Left Array into position ${k} in the main array`);
        renderArray(); // Update the array display
        await new Promise(resolve => setTimeout(resolve, speedRange.value)); // Animation delay
        i++;
        k++;
    }

    // Copy any remaining elements of rightArray[], if any
    while (j < n2) {
        array[k] = rightArray[j];
        updateSteps(`Inserting remaining ${rightArray[j]} from Right Array into position ${k} in the main array`);
        renderArray(); // Update the array display
        await new Promise(resolve => setTimeout(resolve, speedRange.value)); // Animation delay
        j++;
        k++;
    }

    renderArray(); // Final render after merging
}


async function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        // Select the pivot and partition the array
        const pivotIndex = await partition(arr, low, high);
        
        // Log the partition result
        updateSteps(`Quick Sort: Partitioning complete. Pivot (${arr[pivotIndex]}) is now at index ${pivotIndex}.`);

        // Recursively sort elements before and after partition
        await quickSort(arr, low, pivotIndex - 1); // Left side of pivot
        await quickSort(arr, pivotIndex + 1, high); // Right side of pivot
    }

    // When fully sorted
    if (low === 0 && high === arr.length - 1) {
        updateSteps('Quick Sort: Finished. Array is sorted.', '', '', true);
    }
}

async function partition(arr, low, high) {
    const pivot = arr[high];  // Select the last element as pivot
    updateSteps(`Quick Sort: Selected pivot ${pivot} at index ${high}.`);
    let i = low - 1;

    for (let j = low; j < high; j++) {
        // Compare current element with the pivot
        updateSteps(`Quick Sort: Comparing ${arr[j]} with pivot ${pivot}.`);

        if (arr[j] < pivot) {
            i++;
            // Swap if element is smaller than pivot
            await swap(arr, i, j);
            updateSteps(`Quick Sort: Swapped ${arr[i]} and ${arr[j]}.`);
        }
        renderArray(); // Update the array display
        await new Promise(resolve => setTimeout(resolve, speedRange.value));
    }

    // Swap pivot into the correct position
    await swap(arr, i + 1, high);
    updateSteps(`Quick Sort: Moved pivot ${pivot} to index ${i + 1}.`);
    renderArray(); // Update the array display
    await new Promise(resolve => setTimeout(resolve, speedRange.value));

    return i + 1;  // Return the pivot index
}


// Searching Algorithms
async function linearSearch(arr, target) {
    const len = arr.length;
    let searchCompletedFlag = false;

    for (let i = 0; i < len; i++) {
        const bars = document.querySelectorAll('.array-bar');
        bars.forEach(bar => bar.classList.remove('searching')); // Remove previous search class
        bars[i].classList.add('searching'); // Highlight current bar being checked

        updateSteps(`Linear Search: Comparing ${arr[i]} with ${target}`, '', `Comparison: ${arr[i]} == ${target}`);

        if (arr[i] === target) {
            bars[i].classList.remove('searching'); // Remove searching class
            bars[i].classList.add('found'); // Mark the found element
            updateSteps(`Linear Search: Found ${target} at index ${i}`, '', `Comparison: ${arr[i]} == ${target}`, false, true, target);
            searchCompletedFlag = true;
            break;
        } else {
            updateSteps(`Linear Search: ${arr[i]} is not ${target}`, '', `Comparison: ${arr[i]} != ${target}`);
        }

        await new Promise(resolve => setTimeout(resolve, speedRange.value));
    }

    if (!searchCompletedFlag) {
        const bars = document.querySelectorAll('.array-bar');
        bars.forEach(bar => bar.classList.remove('searching')); // Remove searching class from all bars
        actionDisplay.textContent = `${target} not found!`;
        updateSteps(`Linear Search: ${target} not found`, '', '', false, true, target);
    } else {
        updateSteps(`Linear Search: Search Completed`, '', '', false, true, target);
    }
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
        const bars = document.querySelectorAll('.array-bar');
        bars.forEach(bar => bar.classList.remove('searching')); // Remove previous search class
        bars[mid].classList.add('searching'); // Highlight the mid element

        updateSteps(`Binary Search: Checking ${arr[mid]}`, '', `Comparison: ${arr[mid]} == ${target}`);

        if (arr[mid] === target) {
            bars[mid].classList.remove('searching'); // Remove searching class
            bars[mid].classList.add('found'); // Mark the found element
            actionDisplay.textContent = `${target} found at index ${mid}!`;
            updateSteps(`Binary Search: Found ${target} at index ${mid}`, '', `Comparison: ${arr[mid]} == ${target}`, false, true, target);
            return;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }

        await new Promise(resolve => setTimeout(resolve, speedRange.value));
    }

    actionDisplay.textContent = `${target} not found!`;
    updateSteps(`Binary Search: ${target} not found`, '', '', false, true, target);
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

    // Add CSS transition for smooth swapping
    bars[i].style.transition = 'height 0.5s ease, transform 0.5s ease';
    bars[j].style.transition = 'height 0.5s ease, transform 0.5s ease';

    // Temporarily adjust the position to animate swapping
    bars[i].style.transform = `translateY(${heightJ - heightI}px)`; 
    bars[j].style.transform = `translateY(${heightI - heightJ}px)`; 

    // Swap the elements in the array
    [arr[i], arr[j]] = [arr[j], arr[i]];

    // After the transition time, reset the transform property
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the transition to finish

    // Update the heights of the bars after swapping
    bars[i].style.height = `${heightJ}px`;
    bars[j].style.height = `${heightI}px`;

    // Reset the transform property for further animations
    bars[i].style.transform = '';
    bars[j].style.transform = '';

    await new Promise(resolve => setTimeout(resolve, speedRange.value)); // Animation delay after swap
}


let stepCounter = 0; // Initialize step counter globally

// Update steps
function updateSteps(step, swapInfo = '', comparisonResult = '', isSorted = false, searchCompleted = false, searchTarget = '') {
    // Only increment the step number for distinct steps
    if (comparisonResult === '' && swapInfo === '' && !isSorted && !searchCompleted) {
        stepCounter++;
    }

    const stepElement = document.createElement('div');
    const algorithmName = actionDisplay.textContent.split(' ')[0]; // Assuming actionDisplay contains the algorithm name
    
    // Step number and algorithm name (already available)
    if (stepsDisplay.children.length === 0) {
        const algorithmHeader = document.createElement('h3');
        algorithmHeader.textContent = `${algorithmName} Steps:`;
        stepsDisplay.appendChild(algorithmHeader);
    }

    // Display the current step
    if (step) {
        stepElement.textContent = `Step ${stepCounter}: ${step}`;
        stepsDisplay.appendChild(stepElement);
    }

    // Display swapping information if available
    if (swapInfo) {
        const swapElement = document.createElement('div');
        swapElement.textContent = `Swap: ${swapInfo}`;
        stepsDisplay.appendChild(swapElement);
    }

    // Display comparison result if available
    if (comparisonResult) {
        const comparisonElement = document.createElement('div');
        comparisonElement.textContent = `Comparison: ${comparisonResult}`;
        stepsDisplay.appendChild(comparisonElement);
    }

    // Indicate whether the array is sorted (only show "Sorted: Yes" once array is sorted)
    if (isSorted) {
        const sortedElement = document.createElement('div');
        sortedElement.textContent = "Sorted: Yes";
        stepsDisplay.appendChild(sortedElement);
    }

    // Display the final message when the search algorithm is completed
    if (searchCompleted) {
        const searchResult = searchTarget ? `${searchTarget} found` : `Target not found`;
        const searchElement = document.createElement('div');
        searchElement.textContent = `Search Completed: ${searchResult}`;
        stepsDisplay.appendChild(searchElement);
    }
}





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


document.getElementById('saveSteps').addEventListener('click', () => {
    let stepsText = '';
    const algorithmName = actionDisplay.textContent.split(' ')[0]; // Extract algorithm name
    stepsText += `Algorithm: ${algorithmName}\n\n`;  // Add algorithm name as a header

    // Go through each step and create a readable format
    stepCounter = 1; // Reset the step counter for download
    stepsDisplay.querySelectorAll('div').forEach((stepElement, index) => {
        if (index > 0) { // Avoid the first header (algorithm name)
            stepsText += `Step ${stepCounter}: ${stepElement.textContent}\n`;
            if (stepElement.textContent.includes('Swap') || stepElement.textContent.includes('Comparison')) {
                // Group swaps and comparisons under the same step
                stepsText += `  ${stepElement.textContent}\n`;
            } else {
                stepCounter++; // Increment the step counter after each distinct step
            }
        }
    });

    // Create the Blob and download the file
    const blob = new Blob([stepsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'algorithm_steps.txt';
    a.click();
});

