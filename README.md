# ♟️ Ranking UNCuyo — Sistema de Ajedrez Universitario

Plataforma web de ranking de ajedrez interno para la Universidad Nacional de Cuyo. Permite llevar un registro oficial de jugadores, torneos y resultados, con cálculo automático de ELO propio ("ELO UNCuyo").

## ¿Qué es esto?

El sistema actúa como base de datos central del ecosistema competitivo universitario. Los torneos se siguen jugando de forma presencial con herramientas externas como Swiss Manager — esta plataforma registra los resultados y mantiene el ranking actualizado.

**Lo que hace:**
- Ranking público de jugadores con ELO UNCuyo
- Historial de torneos y resultados
- Ranking por facultad
- Panel de administración para cargar jugadores, torneos y partidas

**Lo que NO hace:**
- No organiza torneos ni genera emparejamientos
- No permite jugar ajedrez online

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Spring Boot 3, Java 17 |
| Base de datos | PostgreSQL |

---

## Estructura del proyecto

```
RankingUNCuyo/
├── frontend/     # Next.js app
├── backend/      # Spring Boot API
└── README.md
```

---

## Requisitos previos

- Node.js 18+
- Java 17+
- PostgreSQL 15+
- Maven

---

## Instalación y configuración

### Base de datos

1. Crear una base de datos en PostgreSQL:
```sql
CREATE DATABASE ranking_uncuyo;
```

2. Configurar las credenciales en `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ranking_uncuyo
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_CONTRASEÑA
```

---

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

El backend corre en `http://localhost:8080`

**Endpoints principales:**
- `GET /ranking` — ranking completo
- `GET /players` — lista de jugadores
- `POST /players` — crear jugador
- `GET /tournaments` — lista de torneos
- `POST /tournaments` — crear torneo
- `POST /matches` — cargar resultado de partida
- `GET /matches/tournament/{id}` — partidas de un torneo

---

### Frontend

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Crear el archivo de variables de entorno:
```bash
# frontend/.env.local
ADMIN_PASSWORD=tu_contraseña_admin
```

3. Correr en desarrollo:
```bash
npm run dev
```

El frontend corre en `http://localhost:3000`

---

## Panel de administración

Accedé a `http://localhost:3000/admin` con la contraseña configurada en `.env.local`.

Desde el panel podés:
- Registrar nuevos jugadores
- Crear torneos
- Cargar resultados de partidas (el ELO se recalcula automáticamente)

---

## Flujo de uso después de un torneo

1. El torneo se juega presencialmente con Swiss Manager
2. El admin entra al panel en `/admin`
3. Si hay jugadores nuevos, los registra en la pestaña **Jugadores**
4. Crea el torneo en la pestaña **Torneos**
5. Carga los resultados partida por partida en la pestaña **Partidas**
6. El ranking se actualiza automáticamente

---

## Facultades participantes

- Facultad de Ciencias Políticas y Sociales
- Facultad de Artes y Diseño
- Facultad de Ingeniería
- Facultad de Filosofía y Letras
- Facultad de Ciencias Médicas
- Facultad de Derecho
- Facultad de Ciencias Económicas
- Facultad de Ciencias Exactas y Naturales
- Facultad de Educación
- Facultad de Ciencias Agrarias
- Facultad de Odontología
- Facultad de Ciencias Aplicadas a la Industria

---

## Desarrollado para

**Universidad Nacional de Cuyo — Ajedrez UNCuyo**  
Mendoza, Argentina
