import { useState } from 'react';
import { ProfileForm } from './components/forms/Profile/ProfileForm';
import { ExerciseForm } from './components/forms/Excersise/ExerciseForm';
import { ExerciseSearch } from './components/search/ExerciseSearch';
import { ExerciseCatalog } from './components/catalog/ExerciseCatalog';
import { UnifiedReportView } from './components/catalog/UnifiedReport';
import { RoutineSessions } from './components/routine/RoutineSessions';
import { WeeklyLoadCard } from './components/routine/WeeklyLoadCard';
import { InstructorView } from './components/routine/InstructorView';
import { Dashboard, type DashboardSection } from './components/dashboard/Dashboard';
import Summary from './components/generic/summary';
import { useUserStore } from './store/userStore';
import { flattenRoutine, calculateWeeklyLoad, getRestRecommendation, buildUnifiedReport, buildDashboardSummary } from './utils/calculations';
import { buildInstructor } from './utils/seedData';
import './App.css';

type AppView = 'dashboard' | 'workspace';
export type WorkspaceTab = DashboardSection;

function App() {
  const { isProfileSet, user, incompleteExternalExercises, users, exerciseCatalog, routines, activityLog } =
    useUserStore();
  const [view, setView] = useState<AppView>('dashboard');
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('routine');

  const entries = user !== null ? flattenRoutine(user.assignedRoutine) : [];
  const weeklyLoad = user !== null ? calculateWeeklyLoad(user.assignedRoutine) : null;
  const recommendation = weeklyLoad !== null ? getRestRecommendation(weeklyLoad) : null;
  const instructor = user !== null ? buildInstructor(user) : null;
  const unifiedReport = buildUnifiedReport(entries, incompleteExternalExercises);
  const dashboardSummary = buildDashboardSummary(users, exerciseCatalog, routines, activityLog);

  const handleNavigate = (section: DashboardSection): void => {
    setActiveTab(section);
    setView('workspace');
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>FitTracker</h1>
        {isProfileSet && (
          <nav className="app-nav">
            <button
              type="button"
              className={view === 'dashboard' ? 'app-nav-btn app-nav-btn--active' : 'app-nav-btn'}
              onClick={(): void => setView('dashboard')}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={view === 'workspace' ? 'app-nav-btn app-nav-btn--active' : 'app-nav-btn'}
              onClick={(): void => setView('workspace')}
            >
              Mi espacio
            </button>
          </nav>
        )}
      </header>

      <main className="app-main">
        {!isProfileSet ? (
          <ProfileForm />
        ) : (
          <>
            {view === 'dashboard' && <Dashboard summary={dashboardSummary} onNavigate={handleNavigate} />}

            <div className="dashboard" style={{ display: view === 'workspace' ? 'grid' : 'none' }}>
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
                      <span className={user.isActive ? 'profile-badge' : 'profile-badge profile-badge--inactive'}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                )}
                <ExerciseForm />
              </div>

              <div className="dashboard-right">
                <div className="workspace-tabs" role="tablist" aria-label="Secciones de Mi espacio">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'routine'}
                    className={activeTab === 'routine' ? 'tab-btn tab-btn--active' : 'tab-btn'}
                    onClick={(): void => setActiveTab('routine')}
                  >
                    Mi rutina
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'catalog'}
                    className={activeTab === 'catalog' ? 'tab-btn tab-btn--active' : 'tab-btn'}
                    onClick={(): void => setActiveTab('catalog')}
                  >
                    Catalogo
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'report'}
                    className={activeTab === 'report' ? 'tab-btn tab-btn--active' : 'tab-btn'}
                    onClick={(): void => setActiveTab('report')}
                  >
                    Reporte
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'instructor'}
                    className={activeTab === 'instructor' ? 'tab-btn tab-btn--active' : 'tab-btn'}
                    onClick={(): void => setActiveTab('instructor')}
                  >
                    Instructor
                  </button>
                </div>

                <div className="tab-content" role="tabpanel">
                  {activeTab === 'routine' && user != null && (
                    <>
                      <RoutineSessions routine={user.assignedRoutine} />
                      <ExerciseSearch
                        localCatalogCount={entries.filter((entry) => entry.exercise.source === 'local').length}
                      />
                    </>
                  )}

                  {activeTab === 'catalog' && (
                    entries.length > 0 ? (
                      <>
                        <ExerciseCatalog entries={entries} />
                        <Summary entries={entries} />
                        {user != null && weeklyLoad != null && recommendation != null && (
                          <WeeklyLoadCard
                            routine={user.assignedRoutine}
                            load={weeklyLoad}
                            recommendation={recommendation}
                          />
                        )}
                      </>
                    ) : (
                      <div className="empty-state">
                        <p>Agrega tu primer ejercicio para ver las estadisticas</p>
                      </div>
                    )
                  )}

                  {activeTab === 'report' && <UnifiedReportView report={unifiedReport} />}

                  {activeTab === 'instructor' && instructor != null && <InstructorView instructor={instructor} />}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
