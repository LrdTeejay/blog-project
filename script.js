const stored = localStorage.getItem('blogs');
    const blogs = stored ? JSON.parse(stored) : initialBlogs;
    const blogCardsContainer = document.getElementById("blogCards");
    const modal = document.getElementById("myModal");
    const modalImage = document.getElementById("modalImage");
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");
    const authorDetails = document.getElementById("authorDetails");
    const closeModalBtn = document.querySelector(".close");

    function saveBlogs() {
      localStorage.setItem('blogs', JSON.stringify(blogs));
    }

    function displayBlogs(query = "") {
      blogCardsContainer.innerHTML = "";
      blogs
        .filter(b => b.title.toLowerCase().includes(query.toLowerCase()))
        .forEach(blog => {
          const card = document.createElement('div');
          card.className = "bg-white p-4 rounded-md shadow-md transform hover:scale-105 transition duration-300 relative";
          card.innerHTML = `
            <img src="${blog.imageUrl}" alt="Blog Image" class="w-full h-64 object-cover mb-2">
            <h2 class="text-lg font-bold mb-1">${blog.title}</h2>
           
            <div class="text-sm text-gray-600 mt-2">${blog.date} by ${blog.authorName}</div>
          `;

          const readBtn = document.createElement('a');
          readBtn.href = `details.html?id=${blog.id}`;
          readBtn.textContent = "Read More";
          readBtn.className = "bg-green-600 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2 inline-block";
          card.appendChild(readBtn);

          const delBtn = document.createElement('button');
          delBtn.textContent = "Delete";
          delBtn.className = "ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mt-2 inline-block";
          delBtn.onclick = e => {
            e.stopPropagation();
            blogs.splice(blogs.findIndex(b => b.id === blog.id), 1);
            saveBlogs();
            displayBlogs(document.getElementById('searchInput').value);
          };

          card.appendChild(delBtn);
          blogCardsContainer.append(card);
        });
    }

    function openModal(blog) {
      modalImage.src = blog.imageUrl;
      modalTitle.textContent = blog.title;
      modalContent.textContent = blog.content;
      authorDetails.innerHTML = `<img src="${blog.authorImage}" alt="Author" class="w-6 h-6 rounded-full mr-2">${blog.authorName}`;
      modal.classList.remove("hidden");
    }

    closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));

    document.getElementById("searchButton").onclick = () => displayBlogs(document.getElementById("searchInput").value);
    document.getElementById("searchInput").oninput = e => displayBlogs(e.target.value);

    document.getElementById('blogForm').addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('newTitle').value.trim();
      const description = document.getElementById('newDesc').value.trim();
	   const authorName = document.getElementById('newAuthor').value.trim() || 'Anonymous';
      const file = document.getElementById('newImage').files[0];
      if (!title || !description || !file) return alert('Complete all fields.');

      const reader = new FileReader();
      reader.onload = ev => {
        blogs.unshift({
          id: Date.now(), 
		  category: 'User', 
		  title, 
		  description, 
		  content: description,
          date: new Date().toLocaleDateString(), authorName,
          authorImage: 'https://randomuser.me/api/portraits/lego/1.jpg', imageUrl: ev.target.result
        });
        saveBlogs();
        displayBlogs(document.getElementById("searchInput").value);
        e.target.reset();
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('createButton').addEventListener('click', () =>
      document.getElementById('createBlog').scrollIntoView({ behavior: 'smooth' })
    );
	document.getElementById('top').addEventListener('click', ()=> document.getElementById('createButton').scrollIntoView({behavior: 'smooth'})
);
    displayBlogs();

    