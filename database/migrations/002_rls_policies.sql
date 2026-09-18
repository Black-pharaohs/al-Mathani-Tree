-- ==============================================================================
-- السبع المثاني وعقد التمام — ملحق سياسات الأمان والحوكمة (Row-Level Security - RLS)
-- البند 18 والبند 48 من الوثيقة الهندسية V1
-- ADR-002: اعتماد منصة Supabase (PostgreSQL)
-- ==============================================================================

-- 1. تفعيل حماية الصفوف على كافة الجداول الرئيسية
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE shrines ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. سياسات القراءة العامة (Public Read Policies)
-- السماح للعموم بقراءة كافة السجلات المعتمدة والمنشورة

CREATE POLICY "Public read verified persons"
ON persons FOR SELECT
USING (verification_status = 'verified' OR verification_status = 'canonical');

CREATE POLICY "Public read verified relationships"
ON relationships FOR SELECT
USING (verification_status = 'verified' OR verification_status = 'canonical');

CREATE POLICY "Public read places"
ON places FOR SELECT
USING (true);

CREATE POLICY "Public read shrines"
ON shrines FOR SELECT
USING (is_active = true);

CREATE POLICY "Public read verified claims"
ON claims FOR SELECT
USING (status = 'verified');

CREATE POLICY "Public read sources and books"
ON sources FOR SELECT
USING (is_verified = true);

CREATE POLICY "Public read books"
ON books FOR SELECT
USING (is_verified = true);

CREATE POLICY "Public read citations"
ON citations FOR SELECT
USING (true);

-- 3. سياسات المحققين والباحثين (Researchers & Contributors)
-- السماح للأعضاء المسجلين بإضافة مساهمات واقتراحات مع حفظها تحت المراجعة

CREATE POLICY "Authenticated users submit contributions"
ON contributions FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id AND status = 'pending');

CREATE POLICY "Users read own contributions"
ON contributions FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

-- 4. سياسات المدققين وأعضاء لجنة التحقيق (Reviewers & Senior Editors)
-- السماح للمدققين بالاطلاع على المسودات وتحديث حالة السجلات

CREATE POLICY "Reviewers view pending contributions"
ON contributions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()::text
    AND users.role IN ('reviewer', 'chief_editor', 'admin')
  )
);

CREATE POLICY "Reviewers approve contributions"
ON contributions FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()::text
    AND users.role IN ('reviewer', 'chief_editor', 'admin')
  )
);

-- 5. حصر التعديل النهائي وتاريخ المراجعات (Audit Logs & Revisions)
CREATE POLICY "Admins full access to audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()::text
    AND users.role IN ('chief_editor', 'admin')
  )
);
