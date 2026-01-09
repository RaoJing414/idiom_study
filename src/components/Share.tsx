import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check } from 'lucide-react'

interface ShareProps {
  onBack: () => void
}

const Share: React.FC<ShareProps> = ({ onBack }) => {
  const [copied, setCopied] = React.useState(false)
  const url = window.location.href

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', textAlign: 'center' }}>
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <h3>扫码分享 / 离线安装</h3>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '12px' }}>
          <QRCodeSVG value={url} size={200} />
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          扫描二维码在手机上打开。<br />
          在浏览器菜单中选择“添加到主屏幕”即可离线使用。
        </p>
      </div>

      <div style={{ width: '100%', display: 'flex', gap: '1rem' }}>
        <button className="btn btn-outline" onClick={copyLink} style={{ flex: 1 }}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? '已复制' : '复制链接'}
        </button>
      </div>
      
      <button className="btn btn-primary" onClick={onBack} style={{ width: '100%' }}>
        返回
      </button>
    </div>
  )
}

export default Share
