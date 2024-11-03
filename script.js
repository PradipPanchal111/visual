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
let stepCounter = 0;

// Event listener for the submit button
submitBtn.addEventListener('click', handleSubmit);

function handleSubmit() {
    stepsDisplay.innerHTML = ""; // Clear previous steps
    const input = numbersInput.value.trim();
    
    // Check if the input is empty or contains non-numeric values
    if (!input || !/^\d+( \d+)*$/.test(input)) {
        alert("Please enter a valid list of numbers.");
        return;
    }

    numbers = input.split(' ').map(Number); // Convert input into an array of numbers
    
    if (numbers.length === 0) {
        alert("No valid numbers entered.");
        return;
    }

    renderArray(); // Render the array after filtering
}

// Event listener for sorting button
sortBtn.addEventListener('click', async () => {
    const algorithm = algorithmSelect.value;
    actionDisplay.textContent = `Sorting using ${algorithm}...`;
    stepsDisplay.innerHTML = ""; // Clear previous steps
    stepCounter = 0; // Reset step counter for sorting
    await performSorting(algorithm);
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
    stepCounter = 0; // Reset step counter for searching
    performSearching(searchAlgorithm, searchValue);
});

// Event listener for reset button
resetBtn.addEventListener('click', resetInputs);

// Event listener for clear searched element button
clearSearchedElement.addEventListener('click', clearSearchedElements);

// Event listener for speed range adjustment
speedRange.addEventListener('input', () => {
    speedValue.textContent = `${speedRange.value} ms`;
});

// Save steps to a text file with improved formatting
document.getElementById('saveSteps').addEventListener('click', saveStepsToFile);

// Render the array in bars
function renderArray() {
    arrayContainer.innerHTML = '';
    const maxNum = Math.max(...numbers);
    
    numbers.forEach((num, index) => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        
        // Calculate relative height (max height 300px)
        const height = (num / maxNum) * 300;
        bar.style.height = `${height}px`;
        bar.style.width = `${Math.max(30, 600/numbers.length)}px`; // Responsive width
        
        // Add value label
        bar.textContent = num;
        
        // Add data attributes for animations
        bar.dataset.value = num;
        bar.dataset.index = index;
        
        arrayContainer.appendChild(bar);
    });
}

// Perform sorting based on the selected algorithm
async function performSorting(algorithm) {
    switch (algorithm) {
        case 'bubble':
            await bubbleSort(numbers);
            break;
        case 'selection':
            await selectionSort(numbers);
            break;
        case 'insertion':
            await insertionSort(numbers);
            break;
        case 'merge':
            await mergeSort(numbers);
            break;
        case 'quick':
            await quickSort(numbers);
            break;
        default:
            alert("Invalid sorting algorithm selected.");
    }
}

// Perform searching based on the selected algorithm
function performSearching(searchAlgorithm, searchValue) {
    switch (searchAlgorithm) {
        case 'linear':
            linearSearch(numbers, searchValue);
            break;
        case 'binary':
            if (!isSorted(numbers)) {
                alert("Array must be sorted before performing binary search.");
                return;
            }
            binarySearch(numbers, searchValue);
            break;
        default:
            alert("Invalid search algorithm selected.");
    }
}

// Reset all inputs and states
function resetInputs() {
    numbersInput.value = '';
    arrayContainer.innerHTML = '';
    actionDisplay.textContent = 'Actions will be displayed here...';
    stepsDisplay.innerHTML = '';
    numbers = [];
}

// Clear searched elements from the visual representation
function clearSearchedElements() {
    const bars = document.querySelectorAll('.array-bar');
    bars.forEach(bar => {
        // Remove all special state classes
        bar.classList.remove('found', 'searching', 'checked', 'range', 'comparing', 'current', 'sorted');
        
        // Reset the background color and other styles with animation
        bar.animate([
            { 
                backgroundColor: bar.style.backgroundColor,
                opacity: parseFloat(bar.style.opacity) || 1,
                boxShadow: bar.style.boxShadow
            },
            { 
                backgroundColor: 'initial',
                opacity: 1,
                boxShadow: 'none'
            }
        ], {
            duration: 300,
            easing: 'ease-out',
            fill: 'forwards'
        });

        // Reset inline styles
        bar.style.removeProperty('background');
        bar.style.removeProperty('background-color');
        bar.style.removeProperty('opacity');
        bar.style.removeProperty('box-shadow');
        bar.style.removeProperty('transform');
        
        // If you're using a gradient background, reset to original gradient
        bar.style.background = 'var(--original-background, linear-gradient(to top, #2196F3, #1976D2))';
    });

    // Reset any relevant display text
    actionDisplay.textContent = 'Cleared search visualization';
}

// Save steps to a text file
function saveStepsToFile() {
    let stepsText = '';
    const algorithmName = actionDisplay.textContent.split(' ')[0];
    stepsText += `Algorithm: ${algorithmName}\n\n`;

    let stepCounter = 1;
    stepsDisplay.querySelectorAll('div').forEach((stepElement) => {
        const textContent = stepElement.textContent.trim();
        if (!textContent.startsWith('Step:')) {
            stepsText += `${textContent}\n`;
        } else {
            stepsText += `Step ${stepCounter}: ${textContent.replace(/^Step \d+: /, '')}\n`;
            stepCounter++;
        }
    });

    const blob = new Blob([stepsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'algorithm_steps.txt';
    a.click();
}


// Enhanced swap visualization
async function visualizeSwap(index1, index2) {
    const bars = document.querySelectorAll('.array-bar');
    const bar1 = bars[index1];
    const bar2 = bars[index2];
    
    // Add swapping class for animation
    bar1.classList.add('swapping');
    bar2.classList.add('swapping');
    
    // Calculate positions for swap animation
    const bar1Rect = bar1.getBoundingClientRect();
    const bar2Rect = bar2.getBoundingClientRect();
    const distance = bar2Rect.left - bar1Rect.left;
    
    // Animate the swap
    await Promise.all([
        bar1.animate([
            { transform: 'translateX(0) scale(1)' },
            { transform: `translateX(${distance}px) scale(1.1)` },
            { transform: 'translateX(0) scale(1)' }
        ], {
            duration: parseInt(speedRange.value) * 2,
            easing: 'ease-in-out'
        }).finished,
        bar2.animate([
            { transform: 'translateX(0) scale(1)' },
            { transform: `translateX(${-distance}px) scale(1.1)` },
            { transform: 'translateX(0) scale(1)' }
        ], {
            duration: parseInt(speedRange.value) * 2,
            easing: 'ease-in-out'
        }).finished
    ]);
    
    // Remove swapping class
    bar1.classList.remove('swapping');
    bar2.classList.remove('swapping');
}
// Modify the bubbleSort function to use the enhanced visualization:
async function bubbleSort(arr) {
    const n = arr.length;
    let step = 1;
    const bars = document.querySelectorAll('.array-bar');

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Highlight comparing elements
            bars[j].classList.add('comparing');
            bars[j + 1].classList.add('comparing');
            
            updateStepsDisplay(`Step ${step++}: Comparing ${arr[j]} and ${arr[j + 1]}`);
            actionDisplay.textContent = `Comparing ${arr[j]} and ${arr[j + 1]}`;
            
            await sleep(speedRange.value);

            if (arr[j] > arr[j + 1]) {
                // Visualize swap
                await visualizeSwap(j, j + 1);
                
                // Perform actual swap
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                renderArray();
                
                updateStepsDisplay(`Step ${step++}: Swapped ${arr[j]} and ${arr[j + 1]}`);
                actionDisplay.textContent = `Swapped ${arr[j]} and ${arr[j + 1]}`;
            }

            // Remove comparing highlight
            bars[j].classList.remove('comparing');
            bars[j + 1].classList.remove('comparing');
        }
        
        // Mark sorted element
        bars[n - i - 1].classList.add('sorted');
    }
    
    // Mark first element as sorted
    bars[0].classList.add('sorted');
    
    actionDisplay.textContent = 'Sorting complete!';
    
    // Final animation to show completion
    const allBars = document.querySelectorAll('.array-bar');
    allBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.background = 'linear-gradient(to top, #4CAF50, #45a049)';
        }, index * 50);
    });
}


// Selection Sort
// Enhanced Selection Sort
async function selectionSort(arr) {
    const n = arr.length;
    let step = 1;
    const bars = document.querySelectorAll('.array-bar');

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        bars[i].classList.add('current');

        for (let j = i + 1; j < n; j++) {
            // Highlight comparing elements
            bars[j].classList.add('comparing');
            
            updateStepsDisplay(`Step ${step++}: Comparing ${arr[j]} and ${arr[minIndex]}`);
            actionDisplay.textContent = `Comparing ${arr[j]} and ${arr[minIndex]}`;
            
            await sleep(speedRange.value);

            if (arr[j] < arr[minIndex]) {
                bars[minIndex].classList.remove('min');
                minIndex = j;
                bars[minIndex].classList.add('min');
            }
            
            bars[j].classList.remove('comparing');
        }

        if (minIndex !== i) {
            // Visualize swap
            await visualizeSwap(i, minIndex);
            
            // Perform actual swap
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            renderArray();
            
            updateStepsDisplay(`Step ${step++}: Swapped ${arr[i]} and ${arr[minIndex]}`);
            actionDisplay.textContent = `Swapped ${arr[i]} and ${arr[minIndex]}`;
        }

        bars[i].classList.remove('current');
        bars[i].classList.add('sorted');
    }

    // Mark last element as sorted
    bars[n-1].classList.add('sorted');
    
    actionDisplay.textContent = 'Sorting complete!';
    
    // Final animation
    const allBars = document.querySelectorAll('.array-bar');
    allBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.background = 'linear-gradient(to top, #4CAF50, #45a049)';
        }, index * 50);
    });
}

// Enhanced Insertion Sort
async function insertionSort(arr) {
    const n = arr.length;
    let step = 1;
    const bars = document.querySelectorAll('.array-bar');

    // Mark first element as sorted
    bars[0].classList.add('sorted');

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        
        bars[i].classList.add('current');
        updateStepsDisplay(`Step ${step++}: Inserting ${key}`);
        actionDisplay.textContent = `Inserting ${key}`;
        await sleep(parseInt(speedRange.value));

        while (j >= 0 && arr[j] > key) {
            // Highlight comparing elements
            bars[j].classList.add('comparing');
            bars[j + 1].classList.add('comparing');
            
            updateStepsDisplay(`Step ${step++}: Comparing ${arr[j]} and ${key}`);
            actionDisplay.textContent = `Comparing ${arr[j]} and ${key}`;
            
            await sleep(parseInt(speedRange.value));

            // Visualize swap
            await visualizeSwap(j, j + 1);
            
            // Perform actual swap
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            renderArray();
            
            updateStepsDisplay(`Step ${step++}: Swapped ${arr[j]} and ${arr[j + 1]}`);
            actionDisplay.textContent = `Swapped ${arr[j]} and ${arr[j + 1]}`;

            // Remove comparing highlight
            bars[j].classList.remove('comparing');
            bars[j + 1].classList.remove('comparing');
            
            j--;
        }

        // Remove current highlight
        bars[i].classList.remove('current');
        
        // Mark sorted portion
        for(let k = 0; k <= i; k++) {
            bars[k].classList.add('sorted');
        }
        
        await sleep(parseInt(speedRange.value));
    }
    
    actionDisplay.textContent = 'Sorting complete!';
    
    // Final animation to show completion
    const allBars = document.querySelectorAll('.array-bar');
    allBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.background = 'linear-gradient(to top, #4CAF50, #45a049)';
        }, index * 50);
    });
}


// Enhanced Merge Sort
async function mergeSort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    const bars = document.querySelectorAll('.array-bar');

    // Highlight current section
    for(let i = left; i <= right; i++) {
        bars[i].classList.add('current');
    }
    await sleep(speedRange.value);

    // Remove highlight
    for(let i = left; i <= right; i++) {
        bars[i].classList.remove('current');
    }

    await mergeSort(arr, left, mid);
    await mergeSort(arr, mid + 1, right);
    await merge(arr, left, mid, right);
}

async function merge(arr, left, mid, right) {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);
    const bars = document.querySelectorAll('.array-bar');
    
    let i = 0, j = 0, k = left;
    
    // Highlight merging sections
    for(let x = left; x <= right; x++) {
        bars[x].classList.add('merging');
    }

    while (i < leftArray.length && j < rightArray.length) {
        // Highlight comparing elements
        bars[left + i].classList.add('comparing');
        bars[mid + 1 + j].classList.add('comparing');
        
        updateStepsDisplay(`Step ${stepCounter++}: Comparing ${leftArray[i]} and ${rightArray[j]}`);
        actionDisplay.textContent = `Comparing ${leftArray[i]} and ${rightArray[j]}`;
        
        await sleep(speedRange.value);
        
        if (leftArray[i] <= rightArray[j]) {
            arr[k] = leftArray[i];
            i++;
        } else {
            arr[k] = rightArray[j];
            j++;
        }
        
        renderArray();
        k++;
        
        // Remove comparison highlight
        document.querySelectorAll('.array-bar').forEach(bar => 
            bar.classList.remove('comparing'));
    }

    // Copy remaining elements
    while (i < leftArray.length) {
        arr[k] = leftArray[i];
        renderArray();
        await sleep(speedRange.value);
        i++;
        k++;
    }

    while (j < rightArray.length) {
        arr[k] = rightArray[j];
        renderArray();
        await sleep(speedRange.value);
        j++;
        k++;
    }

    // Remove merging highlight and mark as sorted
    for(let x = left; x <= right; x++) {
        bars[x].classList.remove('merging');
        bars[x].classList.add('sorted');
    }
}


// Enhanced Quick Sort (continued)
async function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        const bars = document.querySelectorAll('.array-bar');
        
        // Highlight current section
        for(let i = left; i <= right; i++) {
            bars[i].classList.add('current');
        }
        await sleep(speedRange.value);

        const pivotIndex = await partition(arr, left, right);
        
        // Remove current highlight
        for(let i = left; i <= right; i++) {
            bars[i].classList.remove('current');
        }

        await quickSort(arr, left, pivotIndex - 1);
        await quickSort(arr, pivotIndex + 1, right);
    }
}

async function partition(arr, left, right) {
    const pivot = arr[right];
    let i = left - 1;
    const bars = document.querySelectorAll('.array-bar');

    // Highlight pivot
    bars[right].classList.add('pivot');

    for (let j = left; j < right; j++) {
        bars[j].classList.add('comparing');
        
        updateStepsDisplay(`Step ${stepCounter++}: Comparing ${arr[j]} with pivot ${pivot}`);
        actionDisplay.textContent = `Comparing ${arr[j]} with pivot ${pivot}`;
        
        await sleep(speedRange.value);

        if (arr[j] < pivot) {
            i++;
            // Visualize swap
            await visualizeSwap(i, j);
            [arr[i], arr[j]] = [arr[j], arr[i]];
            renderArray();
            
            updateStepsDisplay(`Step ${stepCounter++}: Swapped ${arr[i]} and ${arr[j]}`);
            actionDisplay.textContent = `Swapped ${arr[i]} and ${arr[j]}`;
        }

        bars[j].classList.remove('comparing');
    }

    // Visualize final swap with pivot
    await visualizeSwap(i + 1, right);
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    renderArray();
    
    updateStepsDisplay(`Step ${stepCounter++}: Moved pivot ${pivot} to position ${i + 1}`);
    actionDisplay.textContent = `Moved pivot ${pivot} to position ${i + 1}`;

    // Remove pivot highlight
    bars[right].classList.remove('pivot');
    
    // Mark the pivot position as sorted
    bars[i + 1].classList.add('sorted');

    return i + 1;
}

// Linear Search
async function linearSearch(arr, target) {
    const bars = document.querySelectorAll('.array-bar');
    
    // Reset any previous search styling
    bars.forEach(bar => {
        bar.classList.remove('found', 'searching', 'checked');
    });

    for (let i = 0; i < arr.length; i++) {
        // Add searching animation
        bars[i].classList.add('searching');
        
        // Animate the current bar being checked
        bars[i].animate([
            { transform: 'scale(1)', backgroundColor: '#ffd700' },
            { transform: 'scale(1.2)', backgroundColor: '#ff9800' },
            { transform: 'scale(1)', backgroundColor: '#ffd700' }
        ], {
            duration: parseInt(speedRange.value),
            easing: 'ease-in-out'
        });

        updateStepsDisplay(`Step ${i + 1}: Checking element ${arr[i]} at index ${i}`);
        actionDisplay.textContent = `Searching for ${target} - checking element ${arr[i]} at index ${i}`;
        
        await sleep(speedRange.value);

        // Mark as checked
        bars[i].classList.remove('searching');
        bars[i].classList.add('checked');

        if (arr[i] === target) {
            // Found animation
            bars[i].classList.add('found');
            bars[i].animate([
                { transform: 'scale(1)', backgroundColor: '#4CAF50' },
                { transform: 'scale(1.3)', backgroundColor: '#45a049' },
                { transform: 'scale(1)', backgroundColor: '#4CAF50' }
            ], {
                duration: 500,
                iterations: 2,
                easing: 'ease-in-out'
            });

            actionDisplay.textContent = `Found ${target} at index ${i}!`;
            updateStepsDisplay(`Result: ${target} found at index ${i}`);
            return;
        }
    }

    // Not found animation
    bars.forEach(bar => {
        bar.animate([
            { backgroundColor: '#ff6b6b' },
            { backgroundColor: '#original' }
        ], {
            duration: 500,
            easing: 'ease-out'
        });
    });

    actionDisplay.textContent = `${target} not found in the array.`;
    updateStepsDisplay(`Result: ${target} not found in the array.`);
}

// Enhanced Binary Search
async function binarySearch(arr, target) {
    const bars = document.querySelectorAll('.array-bar');
    let left = 0;
    let right = arr.length - 1;

    // Reset any previous search styling
    bars.forEach(bar => {
        bar.classList.remove('found', 'searching', 'checked', 'range');
    });

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        // Highlight current search range
        for (let i = 0; i < bars.length; i++) {
            if (i >= left && i <= right) {
                bars[i].classList.add('range');
            } else {
                bars[i].classList.remove('range');
            }
        }

        // Animate middle element
        bars[mid].classList.add('searching');
        await bars[mid].animate([
            { transform: 'scale(1)', backgroundColor: '#ffd700' },
            { transform: 'scale(1.3)', backgroundColor: '#ff9800' },
            { transform: 'scale(1)', backgroundColor: '#ffd700' }
        ], {
            duration: parseInt(speedRange.value),
            easing: 'ease-in-out'
        }).finished;

        updateStepsDisplay(`Step ${stepCounter++}: Checking middle element ${arr[mid]} at index ${mid}`);
        actionDisplay.textContent = `Searching for ${target} - checking middle element ${arr[mid]}`;
        
        await sleep(speedRange.value);

        if (arr[mid] === target) {
            // Found animation
            bars[mid].classList.remove('searching');
            bars[mid].classList.add('found');
            await bars[mid].animate([
                { transform: 'scale(1)', backgroundColor: '#4CAF50' },
                { transform: 'scale(1.4)', backgroundColor: '#45a049' },
                { transform: 'scale(1)', backgroundColor: '#4CAF50' }
            ], {
                duration: 600,
                iterations: 2,
                easing: 'ease-in-out'
            }).finished;

            actionDisplay.textContent = `${target} found at index ${mid}!`;
            updateStepsDisplay(`Result: ${target} found at index ${mid}`);
            return;
        }

        bars[mid].classList.remove('searching');
        bars[mid].classList.add('checked');

        if (arr[mid] < target) {
            // Animate eliminated left half
            for (let i = left; i <= mid; i++) {
                bars[i].classList.remove('range');
                bars[i].animate([
                    { opacity: 1 },
                    { opacity: 0.3 }
                ], {
                    duration: 300,
                    fill: 'forwards'
                });
            }
            left = mid + 1;
            updateStepsDisplay(`Step ${stepCounter++}: Target is greater, moving right`);
        } else {
            // Animate eliminated right half
            for (let i = mid; i <= right; i++) {
                bars[i].classList.remove('range');
                bars[i].animate([
                    { opacity: 1 },
                    { opacity: 0.3 }
                ], {
                    duration: 300,
                    fill: 'forwards'
                });
            }
            right = mid - 1;
            updateStepsDisplay(`Step ${stepCounter++}: Target is smaller, moving left`);
        }
        await sleep(speedRange.value);
    }
    // Not found animation
    bars.forEach(bar => {
        bar.animate([
            { backgroundColor: '#ff6b6b' },
            { backgroundColor: '#original' }
        ], {
            duration: 500,
            easing: 'ease-out'
        });
    });
    actionDisplay.textContent = `${target} not found in the array.`;
    updateStepsDisplay(`Result: ${target} not found in the array.`);
}
// Utility function to check if the array is sorted
function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) return false;
    }
    return true;
}
// Utility function to sleep for a specified duration
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Update steps display
function updateStepsDisplay(message) {
    const stepElement = document.createElement('div');
    stepElement.textContent = message;
    stepsDisplay.appendChild(stepElement);
}

// Initial setup
function initialize() {
    speedValue.textContent = `${speedRange.value} ms`;
    resetInputs();
}
// Call initialize on page load
window.onload = initialize;