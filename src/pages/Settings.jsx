import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Settings(){
  const [profile, setProfile] = useState({});
  const [notif, setNotif] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  
  useEffect(()=>{
    axios.get('/api/user/settings').then(r=>{
      setProfile({ nickname: r.data.nickname, avatar_path: r.data.avatar_path });
      setNotif(r.data.notification);
    });
  },[]);

  const handleSubmit = async e => {
    e.preventDefault();
    const form = new FormData();
    form.append('nickname', profile.nickname);
    if(avatarFile) form.append('avatar', avatarFile);
    form.append('notification', JSON.stringify({
      enabled: notif.enabled,
      interval_days: notif.interval_days,
      channels: notif.channels,
      email: notif.email,
      line_token: notif.line_token,
    }));
    await axios.post('/api/user/settings', form, {
      headers: {'Content-Type':'multipart/form-data'}
    });
    alert('更新成功');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>個人資料</h2>
      <div>
        <label>暱稱</label>
        <input value={profile.nickname||''}
               onChange={e=>setProfile({...profile,nickname:e.target.value})}/>
      </div>
      <div>
        <label>大頭照</label>
        {profile.avatar_path && <img src={`/storage/${profile.avatar_path}`} alt="avatar" width={80}/>}
        <input type="file" accept="image/*"
               onChange={e=>setAvatarFile(e.target.files[0])}/>
      </div>

      <h2>通知設定</h2>
      <div>
        <label>
          <input type="checkbox" checked={notif.enabled||false}
                 onChange={e=>setNotif({...notif,enabled:e.target.checked})}/>
          啟用通知
        </label>
      </div>
      {notif.enabled && (
        <>
          <div>
            <label>未更新天數</label>
            <select value={notif.interval_days}
                    onChange={e=>setNotif({...notif,interval_days:+e.target.value})}>
              {[1,3,7].map(d=><option key={d} value={d}>{d} 天</option>)}
            </select>
          </div>
          <div>
            <label>通知管道</label>
            {['email','line'].map(ch=>(
              <label key={ch}>
                <input type="checkbox"
                       checked={notif.channels?.includes(ch)||false}
                       onChange={e=>{
                         const arr = notif.channels||[];
                         if(e.target.checked) arr.push(ch);
                         else arr.splice(arr.indexOf(ch),1);
                         setNotif({...notif,channels:arr});
                       }}/>
                {ch}
              </label>
            ))}
          </div>
          {notif.channels?.includes('email') && (
            <div>
              <label>Email 地址</label>
              <input value={notif.email||''}
                     onChange={e=>setNotif({...notif,email:e.target.value})}/>
            </div>
          )}
          {notif.channels?.includes('line') && (
            <div>
              <label>LINE Token</label>
              <input value={notif.line_token||''}
                     onChange={e=>setNotif({...notif,line_token:e.target.value})}/>
            </div>
          )}
        </>
      )}

      <button type="submit">儲存設定</button>
    </form>
  );
}
