import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Info, ArrowLeft } from 'lucide-react';

const Share: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const url = window.location.origin + window.location.pathname;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', textAlign: 'center' }}>
      <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
        <h3 style={{ margin: 0 }}>扫码分享 / 离线安装</h3>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <QRCodeSVG value={url} size={200} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'left', background: 'rgba(var(--primary-rgb), 0.05)', padding: '1rem', borderRadius: '12px' }}>
          <Info size={20} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
          <p style={{ margin: 0 }}>
            扫描二维码在手机上打开。在浏览器菜单中选择<strong>“添加到主屏幕”</strong>，即可像原生 App 一样直接运行，且支持<strong>完全离线使用</strong>。
          </p>
        </div>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button className="btn btn-primary" onClick={copyLink} style={{ width: '100%', height: '3.5rem' }}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? '已复制到剪贴板' : '复制分享链接'}
        </button>
        <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ width: '100%', height: '3.5rem' }}>
          <ArrowLeft size={18} /> 返回上一页
        </button>
      </div>
    </div>
  );
};

export default Share;
