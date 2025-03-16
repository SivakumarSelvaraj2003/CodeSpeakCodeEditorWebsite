async function fetchSavedCodes() {
  const userToken = localStorage.getItem("token");

  if (!userToken) {
    alert("Please log in to view your saved codes.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/get-codes", {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    displayCodes(data);
  } catch (error) {
    console.error("❌ Error fetching codes:", error);
    alert("Failed to fetch saved codes. Please try again.");
  }
}

function displayCodes(codes) {
  const container = document.getElementById("codeContainer");
  container.innerHTML = "";

  codes.forEach((code) => {
    const sanitizedHtml = code.html || "";
    const sanitizedCss = code.css || "";
    const sanitizedJs = code.js || "";

    const codeBlock = document.createElement("div");
    codeBlock.classList.add("saved-code-block");
    codeBlock.innerHTML = `
      <h3 class="code-heading">Saved Code (${new Date(
        code.createdAt
      ).toLocaleString()})</h3>
      
      <div class="code-display">
        <h4><i class='bx bxl-html5'></i> HTML</h4>
        <pre><code class="language-html">${escapeHtml(
          sanitizedHtml
        )}</code></pre>

        <h4><i class='bx bxl-css3' ></i> CSS</h4>
        <pre><code class="language-css">${escapeHtml(sanitizedCss)}</code></pre>

        <h4><i class='bx bxl-javascript' ></i> JavaScript</h4>
        <pre><code class="language-js">${escapeHtml(sanitizedJs)}</code></pre>
      </div>

      <button class="delete-btn" onclick="deleteCode('${
        code._id
      }')">Delete</button>
    `;

    container.appendChild(codeBlock);
  });
}

// ✅ Function to delete a saved code
async function deleteCode(codeId) {
  const userToken = localStorage.getItem("token");

  if (!userToken) {
    alert("Please log in to delete your code.");
    return;
  }

  if (!confirm("Are you sure you want to delete this saved code?")) {
    return;
  }

  try {
    console.log("🗑️ Deleting code with ID:", codeId); // Debugging

    const response = await fetch(
      `http://localhost:5000/delete-code/${codeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const data = await response.json();
    console.log("📡 Server response:", data); // Debugging

    if (response.ok) {
      alert("✅ Code deleted successfully!");
      fetchSavedCodes(); // Refresh the saved codes
    } else {
      alert(`❌ Error: ${data.message}`);
    }
  } catch (error) {
    console.error("❌ Error deleting code:", error);
    alert("Failed to delete the code. Please try again.");
  }
}

// ✅ Function to escape HTML (Prevents breaking the page)
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ✅ Load saved codes when the page is ready
document.addEventListener("DOMContentLoaded", fetchSavedCodes);
