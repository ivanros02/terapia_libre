import mysql.connector
from faker import Faker
import random
from datetime import datetime, timedelta

# Configuración de la conexión a la base de datos
config = {
    'user': 'root',  # Reemplaza con tu usuario de MySQL
    'password': '',  # Reemplaza con tu contraseña de MySQL
    'host': 'localhost',  # Reemplaza si tu base de datos está en otro host
    'database': 'terapia_libre',  # Reemplaza con el nombre de tu base de datos
    'raise_on_warnings': True
}

# Inicializar Faker
fake = Faker('es_ES')  # 'es_ES' para datos en español

# Conectar a la base de datos
try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()

    # Obtener las especialidades disponibles
    cursor.execute("SELECT id_especialidad FROM especialidades")
    especialidades = [row[0] for row in cursor.fetchall()]

    if not especialidades:
        print("No hay especialidades en la tabla. Asegúrate de que la tabla 'especialidades' tenga datos.")
        exit()

    # Insertar 1000 profesionales
    for _ in range(1000):
        # Generar datos ficticios
        nombre = fake.first_name() + " " + fake.last_name()
        titulo_universitario = fake.job()
        matricula_nacional = fake.unique.bothify(text='#######')
        matricula_provincial = fake.unique.bothify(text='#######')
        descripcion = fake.text(max_nb_chars=200)
        telefono = fake.phone_number()
        disponibilidad = random.choice(['24 horas', '48 horas', '72 horas', '96 horas'])
        correo_electronico = fake.unique.email()
        contrasena_hash = fake.md5()  # Hash ficticio
        foto_perfil_url = fake.image_url()
        valor = round(random.uniform(100, 10000), 2)
        valor_internacional = round(random.uniform(10, 1000), 2)
        creado_en = fake.date_time_between(start_date='-1y', end_date='now').strftime('%Y-%m-%d %H:%M:%S')

        # Insertar en la tabla profesionales
        query = """
        INSERT INTO profesionales (
            nombre, titulo_universitario, matricula_nacional, matricula_provincial,
            descripcion, telefono, disponibilidad, correo_electronico, contrasena_hash,
            foto_perfil_url, valor, valor_internacional, creado_en
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            nombre, titulo_universitario, matricula_nacional, matricula_provincial,
            descripcion, telefono, disponibilidad, correo_electronico, contrasena_hash,
            foto_perfil_url, valor, valor_internacional, creado_en
        )
        cursor.execute(query, values)
        profesional_id = cursor.lastrowid  # Obtener el ID del profesional insertado

        # Asignar especialidades al profesional
        num_especialidades = random.randint(1, len(especialidades))  # Entre 1 y todas las especialidades
        especialidades_asignadas = random.sample(especialidades, num_especialidades)

        for especialidad_id in especialidades_asignadas:
            cursor.execute(
                "INSERT INTO profesional_especialidad (id_profesional, id_especialidad) VALUES (%s, %s)",
                (profesional_id, especialidad_id)
            )

    # Confirmar los cambios en la base de datos
    conn.commit()
    print("Se insertaron 1000 registros en la tabla 'profesionales' y sus relaciones en 'profesional_especialidad'.")

except mysql.connector.Error as err:
    print(f"Error: {err}")
finally:
    if conn.is_connected():
        cursor.close()
        conn.close()