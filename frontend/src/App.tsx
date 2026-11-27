import { FormEvent, ReactNode, useMemo, useState } from 'react'

type Screen = 'login' | 'signup' | 'home' | 'mypage'
type ModalType = 'account' | 'subscription' | 'installment' | 'delete' | 'transfer' | null
type Account = { id: number; name: string; bank: string; accountNumber: string; balance: number }
type Subscription = { id: number; name: string; accountId: number; amount: number; day: number }
type Installment = { id: number; name: string; accountId: number; amount: number; total: number; paid: number; day: number }
type Transaction = { id: number; date: string; description: string; accountId: number; type: '입금' | '출금' | '송금'; amount: number }
type ItemType = 'account' | 'subscription' | 'installment'

const initialAccounts: Account[] = [
  { id: 1, name: '생활비 통장', bank: '국민은행', accountNumber: '123-456-789012', balance: 3200000 },
  { id: 2, name: '급여 통장', bank: '신한은행', accountNumber: '110-485-293741', balance: 1850000 },
  { id: 3, name: '비상금 통장', bank: '토스뱅크', accountNumber: '1000-2456-8891', balance: 750000 },
]

const initialSubscriptions: Subscription[] = [
  { id: 1, name: '넷플릭스', accountId: 1, amount: 17000, day: 8 },
  { id: 2, name: '노션 플러스', accountId: 2, amount: 14000, day: 15 },
  { id: 3, name: '클라우드 저장공간', accountId: 1, amount: 11000, day: 22 },
]

const initialInstallments: Installment[] = [
  { id: 1, name: '노트북', accountId: 2, amount: 185000, total: 12, paid: 3, day: 25 },
  { id: 2, name: '휴대폰', accountId: 1, amount: 72000, total: 24, paid: 8, day: 12 },
  { id: 3, name: '거실 소파', accountId: 1, amount: 125000, total: 6, paid: 2, day: 5 },
]

const initialTransactions: Transaction[] = [
  { id: 1, date: '2025. 05. 20.', description: '스타벅스 강남점', accountId: 1, type: '출금', amount: -6200 },
  { id: 2, date: '2025. 05. 19.', description: '5월 급여', accountId: 2, type: '입금', amount: 2850000 },
  { id: 3, date: '2025. 05. 18.', description: '넷플릭스', accountId: 1, type: '출금', amount: -17000 },
  { id: 4, date: '2025. 05. 17.', description: '이마트 역삼점', accountId: 1, type: '출금', amount: -84300 },
  { id: 5, date: '2025. 05. 15.', description: '비상금 저축', accountId: 3, type: '송금', amount: 200000 },
]

const won = (value: number) => `${value.toLocaleString('ko-KR')}원`

function Logo() {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 16.5V9.8c0-.8.4-1.5 1.1-1.9l5-2.8c.6-.3 1.3-.3 1.9 0l5 2.8c.6.4 1 1.1 1 1.9v6.7c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2Z"/><path d="M8.5 13.5h7M8.5 10.5h4"/></svg>
      </span>
      <span>월말 잔고</span>
    </div>
  )
}

function Button({ children, variant = 'primary', className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'text' }) {
  return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">{label}{required && <em>*</em>}</span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}

function AuthLayout({ mode, onNavigate, onSuccess }: { mode: 'login' | 'signup'; onNavigate: () => void; onSuccess: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setSubmitted(true)
    if (mode === 'login') {
      const valid = data.get('userId') === 'demo' && data.get('password') === '1234'
      setFailed(!valid)
      if (valid) onSuccess()
    } else {
      const mismatch = data.get('password') !== data.get('confirm')
      setPasswordMismatch(mismatch)
      if (!mismatch && data.get('userId') && data.get('email') && data.get('name')) onSuccess()
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-glow glow-one" />
      <div className="auth-glow glow-two" />
      <section className="auth-card">
        <div className="auth-heading">
          <Logo />
          <h1>{mode === 'login' ? '다시 만나서 반가워요' : '월말 잔고 시작하기'}</h1>
          <p>{mode === 'login' ? '예정된 지출까지 확인하는 나의 자금 관리' : '간단한 정보로 나만의 자금 관리를 시작해 보세요'}</p>
        </div>
        <form onSubmit={submit} noValidate>
          <Field label="아이디" required error={mode === 'signup' && submitted ? '이미 사용 중인 아이디인지 확인해 주세요.' : undefined}>
            <input name="userId" placeholder="아이디를 입력해 주세요" defaultValue={mode === 'login' ? 'demo' : ''} />
          </Field>
          {mode === 'signup' && (
            <Field label="이메일" required>
              <input name="email" type="email" placeholder="name@example.com" />
            </Field>
          )}
          <Field label="비밀번호" required>
            <input name="password" type="password" placeholder="비밀번호를 입력해 주세요" defaultValue={mode === 'login' ? '1234' : ''} />
          </Field>
          {mode === 'signup' && (
            <Field label="비밀번호 확인" required error={passwordMismatch ? '비밀번호가 일치하지 않습니다.' : undefined}>
              <input name="confirm" type="password" placeholder="비밀번호를 다시 입력해 주세요" />
            </Field>
          )}
          {mode === 'signup' && (
            <Field label="이름" required>
              <input name="name" placeholder="이름을 입력해 주세요" />
            </Field>
          )}
          {mode === 'login' && failed && <div className="alert alert-error">아이디 또는 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.</div>}
          <Button type="submit" className="auth-submit">{mode === 'login' ? '로그인' : '회원가입'}</Button>
        </form>
        {mode === 'login' && <p className="demo-hint">체험용 계정&nbsp; <b>demo</b> / <b>1234</b></p>}
        <div className="auth-footer">
          {mode === 'login' ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          <button onClick={onNavigate}>{mode === 'login' ? '회원가입' : '로그인으로 돌아가기'}</button>
        </div>
      </section>
    </main>
  )
}

function SummaryCard({ label, value, tone, icon }: { label: string; value: number; tone: string; icon: ReactNode }) {
  return (
    <article className={`summary-card ${tone}`}>
      <div>
        <p>{label}</p>
        <strong>{won(value)}</strong>
      </div>
      <span className="summary-icon">{icon}</span>
    </article>
  )
}

const icons = {
  wallet: <svg viewBox="0 0 24 24"><path d="M4 7.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h10"/><path d="M16 12h4v4h-4a2 2 0 1 1 0-4Z"/></svg>,
  calendar: <svg viewBox="0 0 24 24"><path d="M5 4.5h14a2 2 0 0 1 2 2v13H3v-13a2 2 0 0 1 2-2Z"/><path d="M3 9h18M8 2v5M16 2v5"/></svg>,
  check: <svg viewBox="0 0 24 24"><path d="M20 7 10 17l-5-5"/></svg>,
}

function SectionHeader({ title, count, action, onClick }: { title: string; count: number; action: string; onClick: () => void }) {
  return (
    <div className="section-header">
      <div><h2>{title}</h2><span>{count}개</span></div>
      <Button onClick={onClick}><span className="plus">+</span>{action}</Button>
    </div>
  )
}

function Modal({ title, onClose, children, footer, size = '' }: { title: string; onClose: () => void; children: ReactNode; footer: ReactNode; size?: string }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className={`modal ${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <header><h2>{title}</h2><button className="close-btn" onClick={onClose} aria-label="닫기">×</button></header>
        <div className="modal-body">{children}</div>
        <footer>{footer}</footer>
      </section>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [accounts, setAccounts] = useState(initialAccounts)
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions)
  const [installments, setInstallments] = useState(initialInstallments)
  const [transactions, setTransactions] = useState(initialTransactions)
  const [profile, setProfile] = useState({ name: '김민지', userId: 'demo', email: 'minji@example.com' })
  const [modal, setModal] = useState<ModalType>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ type: ItemType; id: number; name: string } | null>(null)
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState('')
  const [transactionType, setTransactionType] = useState('전체')
  const [transactionAccount, setTransactionAccount] = useState('전체')
  const [transactionQuery, setTransactionQuery] = useState('')
  const [transactionPage, setTransactionPage] = useState(1)

  const accountBalance = accounts.reduce((sum, item) => sum + item.balance, 0)
  const planned = subscriptions.reduce((sum, item) => sum + item.amount, 0) + installments.filter((item) => item.paid < item.total).reduce((sum, item) => sum + item.amount, 0)
  const accountName = (id: number) => accounts.find((item) => item.id === id)?.name ?? '삭제된 계좌'
  const filteredTransactions = transactions.filter((item) =>
    (transactionType === '전체' || item.type === transactionType) &&
    (transactionAccount === '전체' || item.accountId === Number(transactionAccount)) &&
    (!transactionQuery || item.description.includes(transactionQuery.trim()))
  )
  const transactionPageSize = 3
  const transactionPageCount = Math.max(1, Math.ceil(filteredTransactions.length / transactionPageSize))
  const visibleTransactions = filteredTransactions.slice((transactionPage - 1) * transactionPageSize, transactionPage * transactionPageSize)

  const editing = useMemo(() => {
    if (editId === null) return null
    if (modal === 'account') return accounts.find((item) => item.id === editId)
    if (modal === 'subscription') return subscriptions.find((item) => item.id === editId)
    if (modal === 'installment') return installments.find((item) => item.id === editId)
    return null
  }, [editId, modal, accounts, subscriptions, installments])

  const openForm = (type: ItemType, id: number | null = null) => {
    setEditId(id)
    setFormError('')
    setModal(type)
  }

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }

  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const text = (key: string) => String(data.get(key) ?? '').trim()
    const num = (key: string) => Number(data.get(key))
    if (!text('name')) return setFormError('필수 항목을 입력해 주세요.')
    const id = editId ?? Date.now()
    if (modal === 'account') {
      if (!text('bank') || !text('accountNumber') || num('balance') < 0) return setFormError('은행명, 계좌번호와 0원 이상의 잔액을 입력해 주세요.')
      const next: Account = { id, name: text('name'), bank: text('bank'), accountNumber: text('accountNumber'), balance: num('balance') }
      setAccounts((items) => editId ? items.map((item) => item.id === editId ? next : item) : [...items, next])
    }
    if (modal === 'subscription') {
      if (!num('accountId') || num('amount') <= 0 || !num('day')) return setFormError('계좌와 올바른 금액, 결제일을 선택해 주세요.')
      const next: Subscription = { id, name: text('name'), accountId: num('accountId'), amount: num('amount'), day: num('day') }
      setSubscriptions((items) => editId ? items.map((item) => item.id === editId ? next : item) : [...items, next])
    }
    if (modal === 'installment') {
      if (!num('accountId') || num('amount') <= 0 || num('total') <= 0 || num('paid') < 0 || num('paid') > num('total') || !num('day')) return setFormError('납부 정보를 올바르게 입력해 주세요. 완료 회차는 전체 회차보다 클 수 없습니다.')
      const next: Installment = { id, name: text('name'), accountId: num('accountId'), amount: num('amount'), total: num('total'), paid: num('paid'), day: num('day') }
      setInstallments((items) => editId ? items.map((item) => item.id === editId ? next : item) : [...items, next])
    }
    setModal(null)
    notify(editId ? '변경 내용이 저장되었습니다.' : '새 항목이 등록되었습니다.')
  }

  const requestDelete = (type: ItemType, id: number, name: string) => {
    setDeleteTarget({ type, id, name })
    setFormError('')
    setModal('delete')
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    if (deleteTarget.type === 'account' && (subscriptions.some((item) => item.accountId === deleteTarget.id) || installments.some((item) => item.accountId === deleteTarget.id))) {
      setFormError('연결된 정기 구독 또는 할부를 변경하거나 삭제한 후 계좌를 삭제해 주세요.')
      return
    }
    if (deleteTarget.type === 'account') setAccounts((items) => items.filter((item) => item.id !== deleteTarget.id))
    if (deleteTarget.type === 'subscription') setSubscriptions((items) => items.filter((item) => item.id !== deleteTarget.id))
    if (deleteTarget.type === 'installment') setInstallments((items) => items.filter((item) => item.id !== deleteTarget.id))
    setModal(null)
    notify('항목이 삭제되었습니다.')
  }

  const transfer = (accountId: number, amount: number, recipient: string) => {
    const account = accounts.find((item) => item.id === accountId)
    if (!account || amount > account.balance) return false
    setAccounts((items) => items.map((item) => item.id === accountId ? { ...item, balance: item.balance - amount } : item))
    setTransactions((items) => [{ id: Date.now(), date: '2025. 05. 20.', description: `${recipient}에게 송금`, accountId, type: '송금', amount: -amount }, ...items])
    notify(`${recipient}님에게 ${won(amount)}을 송금했습니다.`)
    return true
  }

  if (screen === 'login') return <AuthLayout mode="login" onNavigate={() => setScreen('signup')} onSuccess={() => setScreen('home')} />
  if (screen === 'signup') return <AuthLayout mode="signup" onNavigate={() => setScreen('login')} onSuccess={() => setScreen('login')} />

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <Logo />
          <nav className="main-nav" aria-label="주요 메뉴">
            <button className={screen === 'home' ? 'active' : ''} onClick={() => setScreen('home')}>홈</button>
            <button onClick={() => setModal('transfer')}>송금</button>
            <button className={screen === 'mypage' ? 'active' : ''} onClick={() => setScreen('mypage')}>마이페이지</button>
          </nav>
        </div>
        <div className="user-area"><span className="avatar">{profile.name.slice(0, 1)}</span><span><b>{profile.name}</b> 님</span><Button variant="secondary" onClick={() => setScreen('login')}>로그아웃</Button></div>
      </header>
      {screen === 'home' && <main className="dashboard">
        <div className="page-heading">
          <div><p>2025년 5월</p><h1>안녕하세요, {profile.name.slice(1)}님</h1><span>이번 달 자금 현황을 한눈에 확인해 보세요.</span></div>
          <div className="today-badge">기준일&nbsp; 2025. 05. 20.</div>
        </div>
        <section className="summary-grid">
          <SummaryCard label="전체 계좌 잔액" value={accountBalance} tone="blue" icon={icons.wallet} />
          <SummaryCard label="향후 1개월 예정 지출" value={planned} tone="orange" icon={icons.calendar} />
          <SummaryCard label="예상 가용 금액" value={accountBalance - planned} tone="green" icon={icons.check} />
        </section>
        <p className="calculation-note">예정 지출 계산 기간: 2025. 05. 20. ~ 2025. 06. 19. · 해당 기간의 정기 구독료와 할부 납부액을 포함합니다.</p>

        <section className="data-section">
          <SectionHeader title="내 계좌" count={accounts.length} action="계좌 등록" onClick={() => openForm('account')} />
          {accounts.length ? <div className="table-wrap"><table><thead><tr><th>계좌명</th><th>은행명</th><th>계좌번호</th><th className="align-right">잔액</th><th className="manage">관리</th></tr></thead>
            <tbody>{accounts.map((item) => <tr key={item.id}><td><b>{item.name}</b></td><td>{item.bank}</td><td className="account-number">{item.accountNumber}</td><td className="amount">{won(item.balance)}</td><td className="manage"><Button variant="text" onClick={() => openForm('account', item.id)}>수정</Button><Button variant="text" className="delete-text" onClick={() => requestDelete('account', item.id, item.name)}>삭제</Button></td></tr>)}</tbody></table></div>
          : <EmptyState label="등록된 계좌가 없습니다." action="계좌 등록하기" onClick={() => openForm('account')} />}
        </section>

        <section className="data-section">
          <SectionHeader title="정기 구독" count={subscriptions.length} action="구독 등록" onClick={() => openForm('subscription')} />
          {subscriptions.length ? <div className="table-wrap"><table><thead><tr><th>구독명</th><th>연결 계좌</th><th className="align-right">월 결제 금액</th><th>매월 결제일</th><th className="manage">관리</th></tr></thead>
            <tbody>{subscriptions.map((item) => <tr key={item.id}><td><b>{item.name}</b></td><td><span className="account-chip">{accountName(item.accountId)}</span></td><td className="amount">{won(item.amount)}</td><td>매월 {item.day}일</td><td className="manage"><Button variant="text" onClick={() => openForm('subscription', item.id)}>수정</Button><Button variant="text" className="delete-text" onClick={() => requestDelete('subscription', item.id, item.name)}>삭제</Button></td></tr>)}</tbody></table></div>
          : <EmptyState label="등록된 정기 구독이 없습니다." action="구독 등록하기" onClick={() => openForm('subscription')} />}
        </section>

        <section className="data-section">
          <SectionHeader title="할부" count={installments.length} action="할부 등록" onClick={() => openForm('installment')} />
          {installments.length ? <div className="table-wrap"><table><thead><tr><th>항목명</th><th>연결 계좌</th><th className="align-right">월 납부액</th><th>납부 진행 상태</th><th>매월 납부일</th><th className="manage">관리</th></tr></thead>
            <tbody>{installments.map((item) => <tr key={item.id}><td><b>{item.name}</b></td><td><span className="account-chip">{accountName(item.accountId)}</span></td><td className="amount">{won(item.amount)}</td><td><span className={`status ${item.paid >= item.total ? 'complete' : ''}`}>{item.paid >= item.total ? '납부 완료' : `${item.paid} / ${item.total}회 납부`}</span></td><td>매월 {item.day}일</td><td className="manage"><Button variant="text" onClick={() => openForm('installment', item.id)}>수정</Button><Button variant="text" className="delete-text" onClick={() => requestDelete('installment', item.id, item.name)}>삭제</Button></td></tr>)}</tbody></table></div>
          : <EmptyState label="등록된 할부가 없습니다." action="할부 등록하기" onClick={() => openForm('installment')} />}
        </section>

        <section className="data-section">
          <div className="section-header">
            <div><h2>최근 거래 내역</h2><span>{filteredTransactions.length}개</span></div>
            <Button variant="secondary" onClick={() => setModal('transfer')}>송금하기</Button>
          </div>
          <div className="transaction-filters">
            <div className="filter-search"><span aria-hidden="true">⌕</span><input value={transactionQuery} onChange={(e) => { setTransactionQuery(e.target.value); setTransactionPage(1) }} placeholder="거래 내용을 검색해 주세요" /></div>
            <select value={transactionAccount} onChange={(e) => { setTransactionAccount(e.target.value); setTransactionPage(1) }} aria-label="계좌 필터"><option>전체</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</select>
            <div className="type-filter" aria-label="거래 유형 필터">{['전체', '입금', '출금', '송금'].map((type) => <button className={transactionType === type ? 'active' : ''} key={type} onClick={() => { setTransactionType(type); setTransactionPage(1) }}>{type}</button>)}</div>
          </div>
          <div className="table-wrap"><table><thead><tr><th>거래일</th><th>거래 내용</th><th>계좌명</th><th>구분</th><th className="align-right">금액</th></tr></thead>
            <tbody>{visibleTransactions.length ? visibleTransactions.map((item) => <tr key={item.id}><td className="date-cell">{item.date}</td><td><b>{item.description}</b></td><td><span className="account-chip">{accountName(item.accountId)}</span></td><td><span className={`transaction-type ${item.type === '입금' ? 'deposit' : ''}`}>{item.type}</span></td><td className={`transaction-amount ${item.amount > 0 ? 'positive' : ''}`}>{item.amount > 0 ? '+' : '-'}{won(Math.abs(item.amount))}</td></tr>) : <tr><td colSpan={5}><div className="no-results">조건에 맞는 거래 내역이 없습니다.</div></td></tr>}</tbody>
          </table></div>
          <div className="pagination">
            <button disabled={transactionPage === 1} onClick={() => setTransactionPage((page) => page - 1)} aria-label="이전 페이지">‹</button>
            {Array.from({ length: transactionPageCount }, (_, index) => index + 1).map((page) => <button key={page} className={transactionPage === page ? 'active' : ''} onClick={() => setTransactionPage(page)}>{page}</button>)}
            <button disabled={transactionPage === transactionPageCount} onClick={() => setTransactionPage((page) => page + 1)} aria-label="다음 페이지">›</button>
          </div>
        </section>

        <section className="state-samples">
          <div className="state-heading"><h2>기본 상태 안내</h2><p>서비스에서 다음과 같이 상태를 안내합니다.</p></div>
          <div className="state-grid">
            <div className="state-card"><span className="state-dot success">✓</span><div><b>저장·삭제 성공</b><p>완료 알림 후 목록을 바로 갱신합니다.</p></div></div>
            <div className="state-card"><span className="state-dot error">!</span><div><b>입력 오류</b><p>입력 필드 아래에서 원인을 안내합니다.</p></div></div>
            <div className="state-card"><span className="state-dot retry">↻</span><div><b>저장 실패</b><p>입력 내용을 유지하고 재시도를 안내합니다.</p></div></div>
          </div>
        </section>
      </main>}
      {screen === 'mypage' && <MyPage profile={profile} onSave={(next) => { setProfile(next); notify('계정 정보가 저장되었습니다.') }} />}
      <footer className="site-footer">월말 잔고 · 직접 입력으로 간단하게 관리하는 나의 자금 계획</footer>

      {toast && <div className="toast"><span>✓</span>{toast}</div>}

      {(modal === 'account' || modal === 'subscription' || modal === 'installment') && (
        <FormModal type={modal} editing={editing as Account | Subscription | Installment | null} accounts={accounts} error={formError} onClose={() => setModal(null)} onSubmit={save} />
      )}
      {modal === 'delete' && deleteTarget && (
        <Modal title="삭제 확인" onClose={() => setModal(null)} footer={<><Button variant="secondary" onClick={() => setModal(null)}>취소</Button><Button variant="danger" onClick={confirmDelete}>삭제</Button></>}>
          <div className="delete-confirm"><span className="warning-icon">!</span><h3>이 항목을 삭제하시겠습니까?</h3><p><b>‘{deleteTarget.name}’</b> 항목이 목록에서 삭제됩니다.<br />삭제한 정보는 다시 복구할 수 없습니다.</p>{formError && <div className="alert alert-error">{formError}</div>}</div>
        </Modal>
      )}
      {modal === 'transfer' && <TransferModal accounts={accounts} onTransfer={transfer} onClose={() => setModal(null)} />}
    </div>
  )
}

function TransferModal({ accounts, onTransfer, onClose }: { accounts: Account[]; onTransfer: (accountId: number, amount: number, recipient: string) => boolean; onClose: () => void }) {
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState<{ recipient: string; amount: number } | null>(null)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const accountId = Number(data.get('accountId'))
    const amount = Number(data.get('amount'))
    const bank = String(data.get('bank') ?? '')
    const accountNumber = String(data.get('accountNumber') ?? '').trim()
    const recipient = String(data.get('recipient') ?? '').trim()
    if (!accountId || !bank || !accountNumber || !recipient || amount <= 0) {
      setError('모든 필수 항목을 올바르게 입력해 주세요.')
      return
    }
    if (!onTransfer(accountId, amount, recipient)) {
      setError('계좌 잔액이 부족합니다. 송금 금액을 다시 확인해 주세요.')
      return
    }
    setError('')
    setCompleted({ recipient, amount })
  }

  if (completed) return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal transfer-modal" role="dialog" aria-modal="true" aria-label="송금 완료">
        <div className="complete-card">
        <span className="complete-icon">✓</span>
        <p>송금 완료</p>
        <h1>{completed.recipient}님에게<br /><b>{won(completed.amount)}</b>을 보냈습니다.</h1>
        <div className="complete-info"><span>처리 결과</span><b>정상 처리</b></div>
        <Button onClick={onClose}>확인</Button>
        <Button variant="text" onClick={() => setCompleted(null)}>한 번 더 송금하기</Button>
        </div>
      </section>
    </div>
  )

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal transfer-modal" role="dialog" aria-modal="true" aria-label="송금하기">
        <header><div><span className="modal-eyebrow">테스트 송금</span><h2>송금하기</h2></div><button className="close-btn" onClick={onClose} aria-label="닫기">×</button></header>
        <div className="transfer-modal-body">
          <div className="card-title"><span>1</span><div><h2>보내는 계좌</h2><p>송금할 금액이 출금될 계좌를 선택해 주세요.</p></div></div>
          <form id="transfer-form" onSubmit={submit} noValidate>
            <Field label="출금 계좌" required>
              <select name="accountId" defaultValue=""><option value="" disabled>계좌를 선택해 주세요</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name} · {account.bank} · {won(account.balance)}</option>)}</select>
            </Field>
            <div className="form-divider" />
            <div className="card-title"><span>2</span><div><h2>받는 분 정보</h2><p>받는 분의 계좌 정보를 입력해 주세요.</p></div></div>
            <div className="form-row">
              <Field label="은행" required><select name="bank" defaultValue=""><option value="" disabled>은행 선택</option><option>국민은행</option><option>신한은행</option><option>우리은행</option><option>하나은행</option><option>토스뱅크</option></select></Field>
              <Field label="계좌번호" required><input name="accountNumber" inputMode="numeric" placeholder="'-' 없이 숫자만 입력" /></Field>
            </div>
            <Field label="받는 분" required><input name="recipient" placeholder="받는 분 이름을 입력해 주세요" /></Field>
            <Field label="송금 금액" required><div className="input-unit transfer-input"><input name="amount" type="number" min="1" placeholder="0" /><span>원</span></div></Field>
            <div className="quick-amounts">{[10000, 50000, 100000, 500000].map((amount) => <button type="button" key={amount} onClick={(e) => { const input = e.currentTarget.closest('form')?.elements.namedItem('amount') as HTMLInputElement; if (input) input.value = String(Number(input.value || 0) + amount) }}>+{amount / 10000}만원</button>)}</div>
            {error && <div className="alert alert-error transfer-error">{error}</div>}
          </form>
          <div className="inline-test-notice"><span>i</span> 실제 금융 거래는 발생하지 않으며, 내 계좌의 테스트 잔액과 거래 내역만 변경됩니다.</div>
        </div>
        <footer><Button variant="secondary" onClick={onClose}>취소</Button><Button type="submit" form="transfer-form">송금하기</Button></footer>
      </section>
    </div>
  )
}

function MyPage({ profile, onSave }: { profile: { name: string; userId: string; email: string }; onSave: (profile: { name: string; userId: string; email: string }) => void }) {
  const [error, setError] = useState('')
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const next = { name: String(data.get('name') ?? '').trim(), userId: profile.userId, email: String(data.get('email') ?? '').trim() }
    const password = String(data.get('password') ?? '')
    const confirm = String(data.get('confirm') ?? '')
    if (!next.name || !next.email) return setError('이름과 이메일을 입력해 주세요.')
    if (password && password !== confirm) return setError('새 비밀번호가 일치하지 않습니다.')
    setError('')
    onSave(next)
  }
  return (
    <main className="subpage">
      <div className="subpage-heading"><p>계정 관리</p><h1>마이페이지</h1><span>내 계정 정보와 비밀번호를 수정할 수 있습니다.</span></div>
      <div className="mypage-layout">
        <aside className="profile-card"><span className="profile-avatar">{profile.name.slice(0, 1)}</span><h2>{profile.name}</h2><p>{profile.email}</p><div><span>가입일</span><b>2025. 03. 12.</b></div><div><span>등록 계정</span><b>일반 회원</b></div></aside>
        <section className="form-card mypage-form">
          <div className="form-section-heading"><h2>기본 정보</h2><p>회원가입 시 입력한 계정 정보입니다.</p></div>
          <form id="profile-form" onSubmit={submit} noValidate>
            <Field label="아이디"><input value={profile.userId} disabled /><span className="field-help">아이디는 변경할 수 없습니다.</span></Field>
            <Field label="이름" required><input name="name" defaultValue={profile.name} /></Field>
            <Field label="이메일" required><input name="email" type="email" defaultValue={profile.email} /></Field>
            <div className="form-divider" />
            <div className="form-section-heading"><h2>비밀번호 변경</h2><p>변경할 때만 새 비밀번호를 입력해 주세요.</p></div>
            <Field label="새 비밀번호"><input name="password" type="password" placeholder="새 비밀번호를 입력해 주세요" /></Field>
            <Field label="새 비밀번호 확인" error={error.includes('비밀번호') ? error : undefined}><input name="confirm" type="password" placeholder="새 비밀번호를 다시 입력해 주세요" /></Field>
            {error && !error.includes('비밀번호') && <div className="alert alert-error">{error}</div>}
          </form>
          <div className="form-actions"><Button type="submit" form="profile-form">변경 내용 저장</Button></div>
        </section>
      </div>
    </main>
  )
}

function EmptyState({ label, action, onClick }: { label: string; action: string; onClick: () => void }) {
  return <div className="empty-state"><div className="empty-icon">{icons.wallet}</div><b>{label}</b><p>새 항목을 등록하고 자금 현황을 확인해 보세요.</p><Button onClick={onClick}>{action}</Button></div>
}

function FormModal({ type, editing, accounts, error, onClose, onSubmit }: { type: ItemType; editing: Account | Subscription | Installment | null; accounts: Account[]; error: string; onClose: () => void; onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  const names = { account: '계좌', subscription: '정기 구독', installment: '할부' }
  const item = editing as any
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)
  return (
    <Modal title={`${names[type]} ${editing ? '수정' : '등록'}`} onClose={onClose} size={type === 'installment' ? 'modal-wide' : ''} footer={<><Button variant="secondary" onClick={onClose}>취소</Button><Button type="submit" form="item-form">{editing ? '저장' : '등록'}</Button></>}>
      <form id="item-form" onSubmit={onSubmit} noValidate>
        <Field label={type === 'account' ? '계좌명' : type === 'subscription' ? '구독명' : '항목명'} required>
          <input name="name" defaultValue={item?.name ?? ''} placeholder={type === 'account' ? '예: 생활비 통장' : type === 'subscription' ? '예: 넷플릭스' : '예: 노트북'} />
        </Field>
        {type === 'account' ? <>
          <Field label="은행명" required><input name="bank" defaultValue={item?.bank ?? ''} placeholder="예: 국민은행" /></Field>
          <Field label="계좌번호" required><input name="accountNumber" inputMode="numeric" defaultValue={item?.accountNumber ?? ''} placeholder="예: 123-456-789012" /></Field>
          <Field label="잔액" required><div className="input-unit"><input name="balance" type="number" min="0" defaultValue={item?.balance ?? ''} placeholder="0" /><span>원</span></div></Field>
        </> : accounts.length === 0 ? <div className="no-account">먼저 계좌를 등록해 주세요.</div> : <>
          <Field label="연결 계좌" required><select name="accountId" defaultValue={item?.accountId ?? ''}><option value="" disabled>계좌를 선택해 주세요</option>{accounts.map((account) => <option value={account.id} key={account.id}>{account.name} · {account.bank}</option>)}</select></Field>
          <Field label={type === 'subscription' ? '월 결제 금액' : '월 납부액'} required><div className="input-unit"><input name="amount" type="number" min="1" defaultValue={item?.amount ?? ''} placeholder="0" /><span>원</span></div></Field>
          {type === 'installment' && <div className="form-row">
            <Field label="전체 할부 개월 수" required><div className="input-unit"><input name="total" type="number" min="1" defaultValue={item?.total ?? ''} placeholder="12" /><span>개월</span></div></Field>
            <Field label="납부 완료 회차" required><div className="input-unit"><input name="paid" type="number" min="0" defaultValue={item?.paid ?? 0} /><span>회</span></div></Field>
          </div>}
          <Field label={type === 'subscription' ? '매월 결제일' : '매월 납부일'} required><select name="day" defaultValue={item?.day ?? ''}><option value="" disabled>날짜를 선택해 주세요</option>{dayOptions.map((day) => <option value={day} key={day}>매월 {day}일</option>)}</select></Field>
        </>}
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-note"><span>i</span> <b>*</b> 표시는 필수 입력 항목입니다. 입력한 금액은 언제든 수정할 수 있습니다.</div>
      </form>
    </Modal>
  )
}
