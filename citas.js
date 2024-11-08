document.addEventListener("DOMContentLoaded", function() {
    const tablaCalendario = document.getElementById("tabla-calendario");
    const fechaInput = document.getElementById("fecha");
    const horaInput = document.getElementById("hora");
    const especialidadInput = document.getElementById("especialidad");
    const asignarCitaBtn = document.getElementById("asignar-cita");
    const eliminarCitaBtn = document.getElementById("eliminar-cita");
    const currentMonthDisplay = document.getElementById("current-month");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");
    horaInput.addEventListener("change", function() {
        console.log("Hora seleccionada:", horaInput.value);
    });
    let currentMonth = new Date(2024, 10); // Comenzamos en Noviembre 2024
    let selectedDay = null;

    const minDate = new Date(2024, 10);  // Noviembre 2024
    const maxDate = new Date(2025, 12); // diciembre 2025

    // Función para actualizar el mes
    function actualizarMes() {
        const options = { month: "long", year: "numeric" };
        currentMonthDisplay.textContent = currentMonth.toLocaleDateString("es-ES", options);
        prevMonthBtn.disabled = currentMonth <= minDate;
        nextMonthBtn.disabled = currentMonth >= maxDate;
    }
    // Función para generar el calendario
    function generarCalendario() {
        tablaCalendario.innerHTML = ""; // Limpiar tabla
        const diasSemana = ["L", "M", "M", "J", "V", "S", "D"];
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const primerDiaMes = new Date(year, month, 0).getDay();
        const diasMes = new Date(year, month +0, 0).getDate();

        let fila = document.createElement("tr");
        diasSemana.forEach(dia => {
            const th = document.createElement("th");
            th.innerText = dia;
            fila.appendChild(th);
        });
        tablaCalendario.appendChild(fila);

        fila = document.createElement("tr");

        for (let i = 0; i < primerDiaMes; i++) {
            const td = document.createElement("td");
            fila.appendChild(td);
        }

        for (let i = 1; i <= diasMes; i++) {
            const td = document.createElement("td");
            td.innerText = i;

            const fecha = new Date(year, month, i);
            if (fecha.getDay() === 6 || fecha.getDay() === 0 || fecha < minDate || fecha > maxDate) {
                td.classList.add("disabled");
            } else {
                td.addEventListener("click", function() {
                    if (selectedDay) {
                        selectedDay.classList.remove("selected");
                    }
                    selectedDay = td;
                    td.classList.add("selected");
                    fechaInput.value = fecha.toLocaleDateString("es-CO");
                });
            }

            fila.appendChild(td);

            if (fecha.getDay() === 0) {
                tablaCalendario.appendChild(fila);
                fila = document.createElement("tr");
            }
        }

        tablaCalendario.appendChild(fila);
    }

    // Cambiar al mes anterior
    prevMonthBtn.addEventListener("click", function() {
        if (currentMonth > minDate) {
            currentMonth.setMonth(currentMonth.getMonth() - 1);
            generarCalendario();
            actualizarMes();
        }
    });

    // Cambiar al mes siguiente
    nextMonthBtn.addEventListener("click", function() {
        if (currentMonth < maxDate) {
            currentMonth.setMonth(currentMonth.getMonth() + 1);
            generarCalendario();
            actualizarMes();
        }
    });

    // Guardar citas en localStorage
    function guardarCita(cita) {
        let citas = JSON.parse(localStorage.getItem("citas")) || [];
        citas.push(cita);
        localStorage.setItem("citas", JSON.stringify(citas));
    }

    // Asignar cita
    asignarCitaBtn.addEventListener("click", function() {
        const fechaSeleccionada = fechaInput.value;
        const horaSeleccionada = horaInput.value;
        const especialidadSeleccionada = especialidadInput.value;
        const horaMinima = "08:00";
        const horaMaxima = "16:00";
        if (!fechaSeleccionada) {
            alert("Por favor, selecciona una fecha.");
        } else if (!horaSeleccionada) {
            alert("Por favor, selecciona una hora.");
        } else if (horaSeleccionada < horaMinima || horaSeleccionada > horaMaxima) {
            alert(`Por favor, selecciona una hora entre ${horaMinima} y ${horaMaxima}.`);
        } else if (!especialidadSeleccionada) {
            alert("Por favor, selecciona una especialidad.");
        } else {
            const cita = {
                fecha: fechaSeleccionada,
                hora: horaSeleccionada,
                especialidad: especialidadSeleccionada
            };

            guardarCita(cita);
            alert(`Cita asignada:\nFecha: ${fechaSeleccionada}\nHora: ${horaSeleccionada}\nEspecialidad: ${especialidadSeleccionada}`);
            limpiarCampos();
        }
    });

    // Limpiar campos
    function limpiarCampos() {
        fechaInput.value = "";
        horaInput.value = "";
        especialidadInput.value = "";
        if (selectedDay) {
            selectedDay.classList.remove("selected");
            selectedDay = null;
        }
    }

    // Eliminar cita (limpiar campos)
    eliminarCitaBtn.addEventListener("click", function() {
        limpiarCampos();
    });

    // Inicialización
    generarCalendario();
    actualizarMes();
});
