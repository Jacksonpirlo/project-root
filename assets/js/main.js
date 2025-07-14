import axios from 'axios';
const roleShow = document.getElementById('roleView')
roleShow.textContent = localStorage.getItem('role')

function isAuth() {
  const result = localStorage.getItem("Auth") || null;
  const resultBool = result === "true";
  return resultBool;
}
const urlAPi = 'http://localhost:3001/events'
const routes = {
    '/': './index.html',
    '/enrollments': './views/enrollments.html',
    '/events': './views/events.html',
    '/addEvent': './views/addEvent.html',
    '/login': './views/login.html',
    '/register': './views/register.html'
}

document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
        e.preventDefault()
        navigate(e.target.getAttribute('href'))
    }
})

if(!isAuth()) {
    navigate('/login')
    }

async function navigate(pathname) {
    const route = routes[pathname]
    const res = await fetch(route);
    const data = await res.text();
    document.getElementById('view').innerHTML = data
    
    history.pushState({}, "", pathname);

    if( pathname === "/login") {
        setupLoginForm()
    }

     if (pathname === "/addEvent") {
        addEventByForm();
    }

    if (pathname === "/register") {
        register()
    }

    if (pathname === "/events") {
        getEvents()
    }

    if (pathname === "/events" && !isAuth()) {
        pathname === "/login"
    }

    if (pathname === "/enrollments") {
        getEnrollment()
    }
}

window.addEventListener('popstate', (e) => {
    e.preventDefault()
    navigate(location.pathname)
})

// Get students

async function getEvents(url = urlAPi) {
    const tbody = document.getElementById('tbody')
    const user =localStorage.getItem('role') === 'admin';

    try {
        const res = await axios.get(url)
        const events = res.data
        if(user) {
            tbody.innerHTML = events.map(event => `
            
            <tr>
                <td>${event.name}</td>
                <td>${event.description}</td>
                <td>${event.capacity}</td>
                <td>${event.date}</td>
                <td>
                <button data-id="${event.id}" id="" class="edit-btn">Editar</button>
                <button data-id="${event.id}" id="" class="delete-btn">Eliminar</button>
                </td>
            </tr>


            `)
            deleteEvent()
            updateUser()
        } else {
            tbody.innerHTML = events.map(event => `
            
            <tr>
                <td>${event.name}</td>
                <td>${event.description}</td>
                <td>${event.capacity}</td>
                <td>${event.date}</td>
                <td>
                <button data-id="${event.id}" id="" class="reserve-btn">Reservar</button>
                </td>
            </tr>
            `)
            reserveEvent()
        }
    } catch (error){
        console.log(error)
    }
}

// Add student by form


function addEventByForm(url = urlAPi) {
    const form = document.getElementById('form');

    if(!form) {
        console.log('Form not found');
    } {
        form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const name = document.getElementById('name')?.value || ''
        const description = document.getElementById('email')?.value || ''
        const capacity = document.getElementById('number')?.value || ''
        const date = document.getElementById('date')?.value || ''

        const dataUser = {name, description, capacity, date}
            const res = await axios.post(url, dataUser)
            console.log(res.data)
            console.log('Evento agregado!')
            navigate('/events')
    })
    }
}

// Delete Events 

function deleteEvent(url = urlAPi) {

    const user =localStorage.getItem('role') === 'admin'
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async(e) => {
            if (!user) {
                alert('No tienes permisos bro')
            } else {
            const id = e.target.dataset.id
            const remove = await axios.delete(`${url}/${id}`)
            console.log('Evento eliminado')
            console.log(remove.data)
            navigate('/events')
            }
        })
    })
}

// reserve event
const reserveEnpoint = 'http://localhost:3001/reserve'
function reserveEvent(url = reserveEnpoint) {

    const user =localStorage.getItem('role') === 'visitor'
    document.querySelectorAll('.reserve-btn').forEach(button => {
        button.addEventListener('click', async(e) => {
            if (!user) {
                alert('No tienes permisos bro')
            } else {
                const id = e.target.dataset.id
                const res = await axios.get(`http://localhost:3001/events/${id}`)
                console.log(res.data)

                const reserveData = {

                    name: res.data.name,
                    description: res.data.description,
                    capacity: res.data.capacity,
                    date: res.data.date
                }

                const reserve = await axios.post(`${url}`, reserveData)
                console.log('Evento reservado')
                console.log(reserve.data)
                navigate('/enrollments')
            }
        })
    })
}

// Update events

function updateUser(url = urlAPi) {
    const user =localStorage.getItem('role') === 'admin'
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', async(e) => {
            if(!user) {
                alert('No tienes permisos bro')
            } else {
                const name = prompt('Insert new name: ')
                const description = prompt('Insert new Description: ')
                const capacity = prompt('Insert new capacity: ')
                const date = prompt('Insert new date: ')
                const id = e.target.dataset.id
                const update = await axios.put(`${url}/${id}`, {name, description, capacity, date})
                console.log('Evento actualizado')
                console.log(update.data)
                navigate('/events')
            }
        })
    })
}

function setupLoginForm() {
  const form = document.getElementById("login-spa");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    const users = await getUsers();

    // Buscar usuario que coincida
    const foundUser = users.find(
      (u) => u.email === email && String(u.password) === pass
    );

    if (foundUser) {
      localStorage.setItem("Auth", "true");
      localStorage.setItem("role", foundUser.role);
      navigate("/events");
    } else {
      alert("usuario o contraseña son incorrectos");
    }
  });
}

const buttonCloseSession = document.getElementById("close-sesion");
buttonCloseSession.addEventListener("click", () => {
  localStorage.setItem("Auth", "false");
  localStorage.removeItem("role");
    navigate("/login")

});

const urlUsers = 'http://localhost:3001/users'

function register(url = urlUsers) {
    document.getElementById('form').addEventListener('submit', async (e) => {
        e.preventDefault()
        const email = document.getElementById('email')?.value || '';
        const password = document.getElementById('password')?.value || '';
        const confirmPassword = document.getElementById('confirmPassword')?.value || '';
        const role = "visitor"
        const dataUser = { email, password, role }

        if (password === confirmPassword) {
            const response = await axios.post(url, dataUser)
            console.log(response.data)
            navigate("/login")
        }
    })
}

// Enrroment
 const urlEnrolment = 'http://localhost:3001/reserve'
async function getEnrollment(url = urlEnrolment) {
    const tbody = document.getElementById('tbody')
    const user =localStorage.getItem('role') === 'admin';

    try {
        const id = e.target.dataset.id
        const res = await axios.get(`${url}/${id}`)
        const events = res.data
        if(user) {
            tbody.innerHTML = events.map(event => `
            
            <tr>
                <td>${event.name}</td>
                <td>${event.description}</td>
                <td>${event.capacity}</td>
                <td>${event.date}</td>
                <td>
                <button data-id="${event.id}" id="" class="edit-btn">Editar</button>
                <button data-id="${event.id}" id="" class="delete-btn">Eliminar</button>
                </td>
            </tr>


            `)
            deleteEvent()
            updateUser()
        } else {
            tbody.innerHTML = events.map(event => `
            
            <tr>
                <td>${event.name}</td>
                <td>${event.description}</td>
                <td>${event.capacity}</td>
                <td>${event.date}</td>
            </tr>
            `)
        }
    } catch (error){
        console.log(error)
    }
}


export async function getUsers() {
  const res = await fetch("http://localhost:3001/users");
  const data = await res.json();
  return data;
}