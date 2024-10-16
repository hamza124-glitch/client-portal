// Constants for API key and Spreadsheet ID
const API_KEY = 'AIzaSyBQy-IDtj9ayNwLGcR2P9NJAYrdwlcPJCk'; // Your API Key
const SPREADSHEET_ID = '1PxMMRlODjwjIneraH0ayXEtjo-rjGA-fk4K0qF7XSno'; // Your Spreadsheet ID

// Get the SHEET_NAME from localStorage using the 'loginKey' ID
const SHEET_NAME = localStorage.getItem('username') || 'defaultSheetName'; // Use a default name if loginKey is not found

// Build the table header
const tableHeader = `
    <div class="table-header">
        <div class="header-cell">Track ID</div>
        <div class="header-cell">Title</div>
        <div class="header-cell">Artist</div>
        <div class="header-cell">Album</div>
        <div class="header-cell">Record Label</div>
        <div class="header-cell">Songwriter</div>
        <div class="header-cell">Release Date</div>
        <div class="header-cell">Status</div>
    </div>
`;


// Assuming dataContainer is defined elsewhere in your code
dataContainer.innerHTML = tableHeader;

// Set the maximum number of rows per page
const rowsPerPage = 7;
let currentPage = 1; // Start on the first page

// Function to render the table based on the current page
function renderTable(values, page) {
    // Clear the existing table rows
    dataContainer.innerHTML = tableHeader;

    // Calculate the starting and ending index for the current page
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = page * rowsPerPage;

    // Get the slice of data for the current page
    const currentPageData = values.slice(startIndex, endIndex);

    
    // Loop through the current page's rows and create table rows
    currentPageData.forEach(row => {

    
        const tableRow = `
            <div class="table-row">
                <div class="table-cell"><span class="table-cell-highlight">${row[0] || 'N/A'}</span></div>
                <div class="table-cell">${row[1] || 'N/A'}</div>
                <div class="table-cell">${row[2] || 'N/A'}</div>
                <div class="table-cell">${row[3] || 'N/A'}</div>
                <div class="table-cell">${row[4] || 'N/A'}</div>
                <div class="table-cell">${row[5] || 'N/A'}</div>
                <div class="table-cell">${row[6] || 'N/A'}</div>
                <div class="table-cell"><span class="${row[7] === 'Removed' ? 'red' : row[7] === 'In Review' ? 'blue' : row[7] === 'In Progress' ? 'yellow' : row[7] === 'Copyrighted' ? 'green' : ''}">${row[7] || 'N/A'}</span></div>
            </div>
        `;
        dataContainer.innerHTML += tableRow; // Append the row to the data container
    });

const paginationContainer = document.getElementById('paginationContainer'); // Add this line before using it

    
    // Render pagination controls
    renderPaginationControls(values);
}

// Function to render pagination controls
function renderPaginationControls(values) {
    const paginationContainer = document.getElementById('paginationContainer'); // Declare the variable inside the function
    const totalPages = Math.ceil(values.length / rowsPerPage);

    // Clear existing pagination
    paginationContainer.innerHTML = '';

    // Create "Previous" button
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => {
            currentPage--;
            renderTable(values, currentPage);
        };
        paginationContainer.appendChild(prevButton);
    }

    // Create "Next" button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            currentPage++;
            renderTable(values, currentPage);
        };
        paginationContainer.appendChild(nextButton);
    }
}
// Fetching data from the Google Sheets API (this part assumes you have implemented the fetch logic elsewhere)
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        const values = data.values || []; // Access the values from the response

        // Remove the first row if it contains headers
        if (values.length > 0) {
            values.shift(); // Remove the first row
        }

        // Filter out rows with "#N/A"
        const filteredValues = values.filter(row => !row.some(cell => cell === '#N/A'));

        // Initially render the first page
        renderTable(filteredValues, currentPage);
    })
    .catch(error => console.error('Error fetching data:', error)); // Log any errors that occur during the fetch

document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();

    // Filter rows based on the search term
    const filteredValues = allData.filter(row => {
        return row.some(cell => cell.toLowerCase().includes(searchTerm));
        // Remove the first row if it contains headers
        if (values.length > 0) {
            values.shift(); // Remove the first row
        }
        // Loop through rows and filter out rows with "#N/A"
        const filteredValues = [];
        values.forEach(row => {
            // Check if the row contains "#N/A" in any column you want to filter
            if (!row.some(cell => cell === '#N/A')) {
                filteredValues.push(row); // Only add the row if it doesn't contain "#N/A"
            }
        });
    });

    // Reset pagination and display the filtered results
    currentPage = 1;
    displayTable(filteredValues, currentPage);
});

// Function to display the table (modified to accept data)
function displayTable(data, page) {
    dataContainer.innerHTML = tableHeader; // Reset the table header

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const pageData = data.slice(startIndex, endIndex); // Get the data for the current page

    pageData.forEach(row => {
        const tableRow = `
            <div class="table-row">
                <div class="table-cell"><span class="table-cell-highlight">${row[0] || 'N/A'}</span></div>
                <div class="table-cell">${row[1] || 'N/A'}</div>
                <div class="table-cell">${row[2] || 'N/A'}</div>
                <div class="table-cell">${row[3] || 'N/A'}</div>
                <div class="table-cell">${row[4] || 'N/A'}</div>
                <div class="table-cell">${row[5] || 'N/A'}</div>
                <div class="table-cell">${row[6] || 'N/A'}</div>
                <div class="table-cell"><span class="${row[7] === 'Removed' ? 'red' : row[7] === 'In Review' ? 'blue' : row[7] === 'In Progress' ? 'yellow' : row[7] === 'Copyrighted' ? 'green' : ''}">${row[7] || 'N/A'}</span></div>
            </div>
        `;
        dataContainer.innerHTML += tableRow;
    });
}

// Save the data fetched from the Google Sheets API globally
let allData = [];

// Fetching data from the Google Sheets API (this part assumes you have implemented the fetch logic elsewhere)
fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        allData = data.values || []; // Store all the data


        // Loop through rows and filter out rows with "#N/A"
        const filteredValues = [];
        values.forEach(row => {
            // Check if the row contains "#N/A" in any column you want to filter
            if (!row.some(cell => cell === '#N/A')) {
                filteredValues.push(row); // Only add the row if it doesn't contain "#N/A"
            }
        });
        
        // Remove the first row if it contains headers
        if (allData.length > 0) {
            allData.shift(); // Remove the first row (header row)
        }

        // Initially display the first page of results
        displayTable(allData, 1);
    })
    .catch(error => console.error('Error fetching data:', error));


// Event listener for the Full View button
document.getElementById('fullViewButton').addEventListener('click', function () {
    window.location.href = 'full-view.html'; // Redirect to table.html
});