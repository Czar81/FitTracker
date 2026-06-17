import { ProfileForm } from './components/forms/Profile/ProfileForm';
import { ExerciseForm } from './components/forms/Excersise/ExerciseForm';
import { ExerciseCatalog } from './components/catalog/ExerciseCatalog';
import Summary from './components/generic/summary';
import { useUserStore } from './store/userStore';
import { useExerciseStore } from './store/excersiceStore';
import './App.css';

function App() {
  const { isProfileSet, user } = useUserStore();
  const { entries } = useExerciseStore();

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
              {entries.length > 0 ? (
                <>
                  <ExerciseCatalog entries={entries} />
                  <Summary entries={entries} />
                </>
              ) : (
                <div className="empty-state">
                  <p>Agrega tu primer ejercicio para ver las estadisticas</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
