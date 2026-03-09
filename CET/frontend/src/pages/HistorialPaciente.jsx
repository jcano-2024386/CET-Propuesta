import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function HistorialPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/pacientes/${id}/historial`)
      .then(r => setData(r.data.data))
      .catch(() => toast.error('Error cargando historial'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-center"><div className="spinner spinner-dark"></div></div>;
  if (!data) return <div className="empty-state"><h3>Paciente no encontrado</h3></div>;

  const { paciente: p, consultas } = data;

  return (
    <div className="animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/pacientes')}>← Volver</button>
          <div>
            <h1 className="page-title">📋 Historial Médico</h1>
            <p className="page-subtitle">{p.nombre} {p.apellido} — {p.codigoAcademico}</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/consultas')}>+ Nueva Consulta</button>
      </div>

      {/* Ficha del paciente */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Datos del Estudiante</h3>
        <div className="grid-4">
          {[
            ['Código Académico', p.codigoAcademico],
            ['Nombre Completo', `${p.nombre} ${p.apellido}`],
            ['Grado', `${p.grado} ${p.seccion ? `"${p.seccion}"` : ''}`],
            ['Edad', `${p.edad} años`],
            ['Género', p.genero === 'M' ? 'Masculino' : 'Femenino'],
            ['Teléfono', p.telefono || '—'],
            ['Tel. Emergencia', p.telefonoEmergencia || '—'],
            ['Alergias', p.alergias || 'Ninguna'],
          ].map(([label, val]) => (
            <div key={label} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Consultas */}
      <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 16 }}>
        Historial de Consultas ({consultas.length})
      </h3>
      {consultas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div style={{ fontSize: 40 }}>📋</div>
            <h3>Sin consultas registradas</h3>
            <p>Este estudiante no tiene consultas previas</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {consultas.map(c => (
            <div key={c._id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {new Date(c.fechaConsulta).toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Atendido por: {c.encargado?.nombre || '—'} · {new Date(c.fechaConsulta).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className={`badge ${c.estado === 'ACTIVA' ? 'badge-green' : c.estado === 'SEGUIMIENTO' ? 'badge-yellow' : 'badge-gray'}`}>
                  {c.estado}
                </span>
              </div>

              <div className="grid-2" style={{ marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Síntomas</div>
                  <div style={{ fontSize: 14 }}>{c.sintomas}</div>
                </div>
                {c.diagnostico && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Diagnóstico</div>
                    <div style={{ fontSize: 14 }}>{c.diagnostico}</div>
                  </div>
                )}
              </div>

              {c.medicamentosSuministrados?.length > 0 && (
                <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>💊 Medicamentos Suministrados</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {c.medicamentosSuministrados.map((m, i) => (
                      <span key={i} className="badge badge-blue">
                        {m.nombreMedicamento} — {m.cantidad} {m.dosis ? `· ${m.dosis}` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {c.observaciones && (
                <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  📝 {c.observaciones}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
