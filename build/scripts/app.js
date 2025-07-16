let jugadores = [];
let esAdmin = window.esAdmin || false;

console.log('App iniciado. esAdmin:', esAdmin);

function cargarJugadores() {
  console.log('=== INICIANDO CARGA DE JUGADORES ===');
  
  return fetch('/.netlify/functions/get-jugadores')
    .then(res => {
      console.log('Respuesta recibida. Status:', res.status, 'OK:', res.ok);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('Datos JSON recibidos:', data);
      console.log('Tipo de datos:', typeof data, 'Es array:', Array.isArray(data));
      
      // Asegurarnos de que tenemos un array válido
      if (Array.isArray(data)) {
        jugadores = data;
      } else if (data && typeof data === 'object') {
        // Si viene un objeto, intentar extraer un array
        jugadores = data.jugadores || data.record || [];
      } else {
        jugadores = [];
      }
      
      console.log('Jugadores asignados:', jugadores);
      console.log('Cantidad de jugadores:', jugadores.length);
      
      renderJugadores();
      return jugadores;
    })
    .catch(error => {
      console.error('ERROR cargando jugadores:', error);
      const ul = document.getElementById('lista-jugadores');
      if (ul) {
        ul.innerHTML = '<li style="color: red;">Error cargando jugadores: ' + error.message + '</li>';
      }
      return [];
    });
}

function renderJugadores() {
  console.log('=== RENDERIZANDO JUGADORES ===');
  console.log('jugadores array:', jugadores);
  console.log('esAdmin:', esAdmin);
  
  const ul = document.getElementById('lista-jugadores');
  
  if (!ul) {
    console.error('ERROR: No se encontró el elemento #lista-jugadores en el DOM');
    return;
  }
  
  console.log('Elemento lista-jugadores encontrado:', ul);
  
  // Limpiar lista
  ul.innerHTML = '';
  
  if (!jugadores || jugadores.length === 0) {
    ul.innerHTML = '<li>No hay jugadores registrados</li>';
    console.log('No hay jugadores para mostrar');
    return;
  }
  
  console.log('Renderizando', jugadores.length, 'jugadores...');
  
  jugadores.forEach((jugador, idx) => {
    console.log(`Renderizando jugador ${idx + 1}:`, jugador);
    
    const li = document.createElement('li');
    li.style.marginBottom = '10px';
    li.style.padding = '10px';
    li.style.border = '1px solid #ccc';
    li.style.borderRadius = '3px';
    li.style.backgroundColor = '#f9f9f9';
    
    let contenido = `<strong>${jugador.nombre}</strong> (#${jugador.numero})`;
    
    if (esAdmin) {
      contenido += ` <button onclick="eliminarJugador(${idx})" style="margin-left: 10px; background-color: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Eliminar</button>`;
    }
    
    li.innerHTML = contenido;
    ul.appendChild(li);
    
    console.log(`Jugador ${idx + 1} renderizado exitosamente`);
  });
  
  console.log('=== RENDERIZADO COMPLETO ===');
}

function eliminarJugador(idx) {
  console.log('Eliminando jugador en índice:', idx);
  
  if (confirm('¿Estás seguro de que quieres eliminar este jugador?')) {
    const jugadorEliminado = jugadores[idx];
    jugadores.splice(idx, 1);
    console.log('Jugador eliminado:', jugadorEliminado);
    console.log('Lista actualizada:', jugadores);
    renderJugadores();
  }
}

function agregarJugador() {
  console.log('=== AGREGANDO JUGADOR ===');
  
  const nombreInput = document.getElementById('nombre');
  const numeroInput = document.getElementById('numero');
  
  if (!nombreInput || !numeroInput) {
    console.error('ERROR: No se encontraron los campos del formulario');
    alert('Error: No se encontraron los campos del formulario');
    return;
  }
  
  const nombre = nombreInput.value.trim();
  const numero = parseInt(numeroInput.value);
  
  console.log('Datos del formulario:', { nombre, numero });
  
  // Validaciones
  if (!nombre) {
    alert('Por favor ingresa un nombre');
    return;
  }
  
  if (isNaN(numero) || numero < 1 || numero > 99) {
    alert('Por favor ingresa un número válido (1-99)');
    return;
  }
  
  // Verificar si el número ya existe
  if (jugadores.some(j => j.numero === numero)) {
    alert('Este número ya está en uso');
    return;
  }
  
  const nuevoJugador = { nombre, numero };
  jugadores.push(nuevoJugador);
  
  console.log('Jugador agregado:', nuevoJugador);
  console.log('Lista actualizada:', jugadores);
  
  renderJugadores();
  
  // Limpiar formulario
  nombreInput.value = '';
  numeroInput.value = '';
  
  alert('Jugador agregado. No olvides hacer clic en "Guardar Cambios" para persistir los datos.');
}

function guardarCambios() {
  console.log('=== GUARDANDO CAMBIOS ===');
  console.log('Datos a guardar:', jugadores);
  
  if (jugadores.length === 0) {
    alert('No hay jugadores para guardar');
    return;
  }
  
  // Buscar el botón que disparó el evento
  const btnGuardar = document.querySelector('.guardar-btn') || event.target;
  const textoOriginal = btnGuardar.textContent;
  btnGuardar.textContent = 'Guardando...';
  btnGuardar.disabled = true;
  
  fetch('/.netlify/functions/update-jugadores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jugadores)
  })
  .then(res => {
    console.log('Respuesta del servidor:', res.status, res.ok);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(result => {
    console.log('Cambios guardados exitosamente:', result);
    alert('¡Cambios guardados exitosamente!');
  })
  .catch(error => {
    console.error('ERROR guardando cambios:', error);
    alert('Error al guardar los cambios. Por favor intenta de nuevo.');
  })
  .finally(() => {
    // Restaurar botón
    btnGuardar.textContent = textoOriginal;
    btnGuardar.disabled = false;
  });
}

// Configurar formulario cuando la página esté lista
function configurarFormulario() {
  console.log('=== CONFIGURANDO FORMULARIO ===');
  
  if (!esAdmin) {
    console.log('No es admin, saltando configuración de formulario');
    return;
  }
  
  const form = document.getElementById('form-jugador');
  if (!form) {
    console.log('No se encontró el formulario #form-jugador');
    return;
  }
  
  console.log('Formulario encontrado, configurando evento submit');
  
  form.onsubmit = function(e) {
    e.preventDefault();
    console.log('Formulario enviado');
    agregarJugador();
  };
  
  console.log('Formulario configurado exitosamente');
}

// Función de inicialización
function inicializar() {
  console.log('=== INICIALIZACIÓN ===');
  console.log('DOM ready state:', document.readyState);
  console.log('esAdmin:', esAdmin);
  
  cargarJugadores()
    .then(() => {
      console.log('Jugadores cargados, configurando formulario...');
      configurarFormulario();
    })
    .catch(error => {
      console.error('Error en inicialización:', error);
    });
}

// Múltiples formas de asegurar que se ejecute cuando esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}

window.onload = function() {
  console.log('Window.onload ejecutado');
  // Solo ejecutar si no se ha ejecutado ya
  if (jugadores.length === 0) {
    inicializar();
  }
};
