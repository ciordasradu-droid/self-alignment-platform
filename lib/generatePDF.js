import jsPDF from 'jspdf'

export async function generateProfilePDF(profile) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const { full_name, sections, swot, alignment_plan } = profile

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = 20

  const checkNewPage = (needed = 20) => {
    if (y + needed > 270) {
      doc.addPage()
      y = 20
    }
  }

  const addText = (text, fontSize = 11, isBold = false, color = [50, 50, 50]) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, contentWidth)
    checkNewPage(lines.length * 6)
    doc.text(lines, margin, y)
    y += lines.length * 6 + 2
  }

  const addSectionTitle = (title) => {
    checkNewPage(16)
    y += 4
    doc.setFillColor(240, 240, 240)
    doc.rect(margin, y - 5, contentWidth, 10, 'F')
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 30)
    doc.text(title, margin + 3, y + 2)
    y += 10
  }

  const addBullet = (text) => {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    const lines = doc.splitTextToSize(`• ${text}`, contentWidth - 4)
    checkNewPage(lines.length * 5)
    doc.text(lines, margin + 4, y)
    y += lines.length * 5 + 2
  }

  // Header
  doc.setFillColor(20, 20, 20)
  doc.rect(0, 0, pageWidth, 35, 'F')
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('Your Alignment Profile', margin, 18)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated for ${full_name}`, margin, 28)
  y = 45

  // Blueprint
  addSectionTitle('Core Energetic Blueprint')
  addText(sections?.blueprint || '')
  y += 4

  // Strengths
  addSectionTitle('Natural Strengths')
  sections?.strengths?.forEach(item => addBullet(item))
  y += 4

  // Vulnerabilities
  addSectionTitle('Natural Vulnerabilities')
  sections?.vulnerabilities?.forEach(item => addBullet(item))
  y += 4

  // Energy Patterns
  addSectionTitle('Energy Patterns')
  sections?.energy_patterns?.forEach(item => addBullet(item))
  y += 4

  // Self-Sabotage
  addSectionTitle('Self-Sabotage Tendencies')
  sections?.sabotage_tendencies?.forEach(item => addBullet(item))
  y += 4

  // Decision Making
  addSectionTitle('Decision-Making Style')
  sections?.decision_making?.forEach(item => addBullet(item))
  y += 4

  // Work & Discipline
  addSectionTitle('Work & Discipline Profile')
  sections?.work_discipline?.forEach(item => addBullet(item))
  y += 4

  // SWOT
  addSectionTitle('SWOT Analysis — Discipline Focus')
  addText('Strengths', 11, true)
  swot?.strengths?.forEach(item => addBullet(item))
  y += 2
  addText('Weaknesses', 11, true)
  swot?.weaknesses?.forEach(item => addBullet(item))
  y += 2
  addText('Opportunities', 11, true)
  swot?.opportunities?.forEach(item => addBullet(item))
  y += 2
  addText('Threats', 11, true)
  swot?.threats?.forEach(item => addBullet(item))
  y += 4

  // Alignment Plan
  addSectionTitle('Alignment Plan')

  addText('Layer 1 — Directional Clarity', 11, true)
  addText(alignment_plan?.directional_clarity?.life_direction || '')
  y += 2
  addText('Prioritize:', 10, true)
  alignment_plan?.directional_clarity?.prioritize?.forEach(item => addBullet(item))
  addText('Eliminate:', 10, true)
  alignment_plan?.directional_clarity?.eliminate?.forEach(item => addBullet(item))
  y += 4

  addText('Layer 2 — Structured Plan', 11, true)
  addText('30-Day Focus:', 10, true)
  addText(alignment_plan?.structured_plan?.thirty_day_focus || '')
  y += 2
  addText('Weekly Template:', 10, true)
  alignment_plan?.structured_plan?.weekly_template?.forEach(item => addBullet(item))
  addText('Daily Template:', 10, true)
  alignment_plan?.structured_plan?.daily_template?.forEach(item => addBullet(item))
  y += 4

  addText('Layer 3 — Behavioral Anchors', 11, true)
  addText('Keystone Habits:', 10, true)
  alignment_plan?.behavioral_anchors?.keystone_habits?.forEach(item => addBullet(item))
  addText('Anti-Sabotage Rules:', 10, true)
  alignment_plan?.behavioral_anchors?.anti_sabotage_rules?.forEach(item => addBullet(item))
  addText('Non-Negotiables:', 10, true)
  alignment_plan?.behavioral_anchors?.non_negotiables?.forEach(item => addBullet(item))

  // Footer on each page
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.setFont('helvetica', 'normal')
    doc.text('Self Alignment Platform — Confidential', margin, 290)
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, 290)
  }

  doc.save(`alignment-profile-${full_name?.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}