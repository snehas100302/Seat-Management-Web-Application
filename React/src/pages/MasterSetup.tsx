import React from 'react';
import { Settings, Building2, School, GraduationCap } from 'lucide-react';

const MasterSetup: React.FC = () => {
    const sections = [
        { title: 'Institution', icon: Building2, fields: ['Name', 'Code', 'Address'] },
        { title: 'Campus', icon: School, fields: ['Name', 'Location', 'In-charge'] },
        { title: 'Department', icon: GraduationCap, fields: ['Name', 'HOD', 'Capacity'] },
    ];

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '1.5rem',
        border: '1px solid var(--border-color)'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        marginTop: '0.5rem',
        fontSize: '0.9rem'
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings className="text-primary" /> Master Setup
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Configure your institution's foundation details.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {sections.map(section => (
                    <div key={section.title} style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                            <section.icon size={20} color="var(--primary)" />
                            <h3 style={{ fontWeight: 600 }}>{section.title} Details</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {section.fields.map(field => (
                                <div key={field}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>{field}</label>
                                    <input type="text" placeholder={`Enter ${field.toLowerCase()}`} style={inputStyle} />
                                </div>
                            ))}
                            <button style={{
                                marginTop: '1rem',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}>
                                Save {section.title}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MasterSetup;
