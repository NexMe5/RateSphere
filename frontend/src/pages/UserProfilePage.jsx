import { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Loader from '../components/common/Loader';
import { getProfileApi } from '../api/auth.api';
import StarRating from '../components/common/StarRating';

const UserProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfileApi();
                setProfile(res.data.data);
            } catch (err) {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <PageWrapper><Loader /></PageWrapper>;
    if (error) return <PageWrapper><div className="error-message" style={{ margin: '30px', color: 'red' }}>{error}</div></PageWrapper>;

    const { user, ratings, totalPoints } = profile;

    // Calculate progress for Swiggy coupons
    const nextTier = totalPoints < 50 ? 50 : (totalPoints < 100 ? 100 : "MAX");
    const progressPercent = nextTier !== "MAX" ? (totalPoints / nextTier) * 100 : 100;

    return (
        <PageWrapper>
            <div className="page-header">
                <h1>👤 My Profile</h1>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {/* User Card */}
                <div className="card" style={{ flex: '1', minWidth: '300px' }}>
                    <h3>Personal Details</h3>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Address:</strong> {user.address || 'No address provided'}</p>
                    <p><strong>Role:</strong> <span style={{ textTransform: 'capitalize' }}>{user.role.replace('_', ' ')}</span></p>
                </div>

                {/* Rewards Card */}
                <div className="card" style={{ flex: '1', minWidth: '300px', background: 'linear-gradient(135deg, rgba(230,92,0,0.1), rgba(249,168,38,0.1))', border: '1px solid #e65c00' }}>
                    <h3 style={{ color: '#e65c00' }}>🎁 Rewards & Points</h3>
                    <h1 style={{ fontSize: '3rem', margin: '10px 0', color: '#e65c00' }}>{totalPoints} <span style={{ fontSize: '1rem' }}>pts</span></h1>
                    <p>Earn 10 points for every store you rate!</p>

                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Progress to next reward:</span>
                            <strong>{nextTier === "MAX" ? "All rewards unlocked!" : `${totalPoints} / ${nextTier} pts`}</strong>
                        </div>
                        <div style={{ width: '100%', height: '12px', background: '#2c2c2c', borderRadius: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#ff7e00', transition: 'width 0.5s ease-in-out' }}></div>
                        </div>
                        <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 5px 0' }}>Unlock Tiers:</h4>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                <li style={{ color: totalPoints >= 50 ? '#00cc66' : 'inherit' }}>50 pts: 🎟️ Swiggy 10% Off Coupon {totalPoints >= 50 && '✅'}</li>
                                <li style={{ color: totalPoints >= 100 ? '#00cc66' : 'inherit' }}>100 pts: 👑 Premium Features + 20% Coupon {totalPoints >= 100 && '✅'}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>⭐ My Past Ratings</h2>
            {ratings.length === 0 ? (
                <p>You haven't rated any stores yet. Head over to the Map to discover places!</p>
            ) : (
                <div className="store-grid">
                    {ratings.map(r => (
                        <div key={r.id} className="store-card">
                            <div className="store-card-header">
                                <h3 className="store-name">{r.stores.name}</h3>
                                <StarRating value={r.rating} readOnly />
                            </div>
                            <p className="store-address">📍 {r.stores.address}</p>
                            <div className="store-card-footer">
                                <span style={{ fontSize: '0.8em', color: '#888' }}>Rated on: {new Date(r.created_at).toLocaleDateString()}</span>
                                <strong style={{ color: '#e65c00' }}>+10 pts</strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageWrapper>
    );
};

export default UserProfilePage;
