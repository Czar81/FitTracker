import { ProfileForm } from './components/forms/Profile/ProfileForm';
import { ExerciseForm } from './components/forms/Excersise/ExerciseForm';
import { ExerciseCatalog } from './components/catalog/ExerciseCatalog';
import { RoutineSessions } from './components/routine/RoutineSessions';
import { WeeklyLoadCard } from './components/routine/WeeklyLoadCard';
import { InstructorView } from './components/routine/InstructorView';
import Summary from './components/generic/summary';
import { useUserStore } from './store/userStore';
import { flattenRoutine, calculateWeeklyLoad, getRestRecommendation } from './utils/calculations';
import { buildInstructor } from './utils/seedData';
import './App.css';

function App() {
  const { isProfileSet, user } = useUserStore();

  const entries = user !== null ? flattenRoutine(user.assignedRoutine) : [];
  const weeklyLoad = user !== null ? calculateWeeklyLoad(user.assignedRoutine) : null;
  const recommendation = weeklyLoad !== null ? getRestRecommendation(weeklyLoad) : null;
  const instructor = user !== null ? buildInstructor(user) : null;

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>FitTracker</h1>
      </header>

      <main className="app-main">
        {!isProfileSet ? (
          <ProfileForm />
        ) : (
          <div className="dashboard">
            <div className="dashboard-left">
              {user != null && (
                <div className="profile-card">
                  <h2>Perfil de usuario</h2>
                  <div className="profile-divider" />
                  <div className="profile-row">
                    <span className="profile-label">Nombre</span>
                    <span className="profile-value">{user.name}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Edad</span>
                    <span className="profile-value">{user.age}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Email</span>
                    <span className="profile-value">{user.email}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Nivel</span>
                    <span className="profile-badge">{user.experienceLevel}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Membresía</span>
                    <span className="profile-badge">{user.membershipLevel}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Desde</span>
                    <span className="profile-value">{user.memberSince}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Estado</span>
                    <span className={user.isActive ? "profile-badge" : "profile-badge profile-badge--inactive"}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              )}
              <ExerciseForm />
            </div>

            <div className="dashboard-right">
              {user != null && <RoutineSessions routine={user.assignedRoutine} />}

              {entries.length > 0 ? (
                <>
                  <ExerciseCatalog entries={entries} />
                  <Summary entries={entries} />
                  {user != null && weeklyLoad != null && recommendation != null && (
                    <WeeklyLoadCard routine={user.assignedRoutine} load={weeklyLoad} recommendation={recommendation} />
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <p>Agrega tu primer ejercicio para ver las estadisticas</p>
                </div>
              )}

              {instructor != null && <InstructorView instructor={instructor} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
