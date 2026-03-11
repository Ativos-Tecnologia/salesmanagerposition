import { supabase, supabasePublic } from '../lib/supabase';
import type { ApplicationFormData } from '../types/application';

/**
 * Transforma os dados do formulário para o formato do banco de dados
 */
function transformFormDataToDatabase(formData: ApplicationFormData) {
  return {
    // Step 0
    step0_accepted: formData.step0.accepted,
    mission_motivation: formData.step0.missionMotivation,

    // Step 1 - Outcomes (JSONB array)
    outcomes: formData.step1.outcomes,

    // Step 2 - Competências (JSONB array)
    competencies: formData.step2.competencies,

    // Step 3 - Informações Pessoais
    full_name: formData.step3.personalInfo.fullName,
    cpf: formData.step3.personalInfo.cpf,
    birth_date: formData.step3.personalInfo.birthDate,
    city: formData.step3.personalInfo.city,
    state: formData.step3.personalInfo.state,

    // Step 3 - Contato
    email: formData.step3.contact.email,
    whatsapp: formData.step3.contact.whatsapp,

    // Step 3 - Profissional
    github_link: formData.step3.githubLink || null,
    salary_expectation: formData.step3.salaryExpectation,
    availability: formData.step3.availability,
    final_notes: formData.step3.finalNotes || null,
    documents: formData.step3.files.map((file: File) => file.name),

    // Status inicial
    status: 'pending',
  };
}

/**
 * Envia a aplicação completa para o Supabase
 */
export async function submitApplication(
  formData: ApplicationFormData
): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
  try {
    // Gerar UUID no cliente para evitar o SELECT após INSERT (problema de RLS com anon)
    const applicationId = crypto.randomUUID();
    const dbData = {
      id: applicationId,
      ...transformFormDataToDatabase(formData),
    };

    // Usar cliente público (sem autenticação) para inserção — sem .select()
    const { error: dbError } = await supabasePublic
      .from('applications')
      .insert([dbData]);

    if (dbError) {
      return { success: false, error: dbError };
    }

    // 2. Se houver arquivos, fazer upload
    if (formData.step3.files && formData.step3.files.length > 0) {
      const uploadResult = await uploadDocuments(
        formData.step3.files,
        applicationId
      );

      if (!uploadResult.success) {
        console.error('Erro ao fazer upload de arquivos:', uploadResult.error);
        return {
          success: true,
          data: { id: applicationId },
          error: {
            message: 'Aplicação criada, mas erro ao enviar arquivos',
            uploadError: uploadResult.error,
          },
        };
      }

      // 3. Atualizar a aplicação com os caminhos dos arquivos
      const { error: updateError } = await supabase
        .from('applications')
        .update({ documents: uploadResult.urls || [] })
        .eq('id', applicationId);

      if (updateError) {
        console.error('Erro ao atualizar documentos:', updateError);
      }
    }

    return { success: true, data: { id: applicationId } };
  } catch (error) {
    console.error('Erro ao enviar aplicação:', error);
    return { success: false, error };
  }
}

/**
 * Faz upload dos arquivos para o Supabase Storage
 */
export async function uploadDocuments(
  files: File[],
  applicationId: string
): Promise<{ success: boolean; urls?: string[]; error?: unknown }> {
  try {
    if (!files || files.length === 0) {
      return { success: true, urls: [] };
    }

    const uploadPromises = files.map(async file => {
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${applicationId}/${timestamp}_${sanitizedFileName}`;

      const { error } = await supabase.storage
        .from('files-sales-manager')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error(`Erro ao fazer upload de ${file.name}:`, error);
        throw error;
      }

      // Retornar o caminho completo do arquivo
      return filePath;
    });

    const filePaths = await Promise.all(uploadPromises);

    return { success: true, urls: filePaths };
  } catch (error) {
    console.error('Erro ao fazer upload de documentos:', error);
    return { success: false, error };
  }
}

/**
 * Obtém a URL assinada (autenticada) para download de um arquivo do Storage
 * URLs assinadas funcionam mesmo com buckets privados
 */
export async function getFileUrl(filePath: string): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from('files-sales-manager')
      .createSignedUrl(filePath, 3600); // URL válida por 1 hora

    if (error) {
      console.error('Erro ao gerar URL assinada:', error);
      // Fallback para URL pública (caso o bucket seja público)
      const { data: publicData } = supabase.storage
        .from('files-sales-manager')
        .getPublicUrl(filePath);
      return publicData.publicUrl;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Erro ao obter URL do arquivo:', error);
    return '';
  }
}

/**
 * Obtém URLs assinadas de múltiplos arquivos
 */
export async function getFileUrls(filePaths: string[]): Promise<string[]> {
  const urlPromises = filePaths.map(path => getFileUrl(path));
  return await Promise.all(urlPromises);
}

/**
 * Busca todas as aplicações (apenas para admins autenticados)
 * @param archived - Se true, busca apenas arquivadas. Se false, busca apenas não arquivadas. Se undefined, busca todas.
 */
export async function getAllApplications(archived?: boolean) {
  try {
    let query = supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    // Se archived for definido, filtra por esse valor
    if (archived !== undefined) {
      query = query.eq('archived', archived);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar aplicações:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar aplicações:', error);
    return { success: false, error };
  }
}

/**
 * Busca uma aplicação específica por ID
 */
export async function getApplicationById(id: string) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar aplicação:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar aplicação:', error);
    return { success: false, error };
  }
}

/**
 * Atualiza o status de uma aplicação
 */
export async function updateApplicationStatus(id: string, status: string) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar status:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return { success: false, error };
  }
}

/**
 * Deleta uma aplicação
 */
export async function deleteApplication(id: string) {
  try {
    const { error } = await supabase.from('applications').delete().eq('id', id);

    if (error) {
      console.error('Erro ao deletar aplicação:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar aplicação:', error);
    return { success: false, error };
  }
}

/**
 * Arquiva uma aplicação
 */
export async function archiveApplication(id: string) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao arquivar aplicação:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao arquivar aplicação:', error);
    return { success: false, error };
  }
}

/**
 * Desarquiva uma aplicação
 */
export async function unarchiveApplication(id: string) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({ archived: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao desarquivar aplicação:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao desarquivar aplicação:', error);
    return { success: false, error };
  }
}

/**
 * Busca estatísticas das aplicações
 */
export async function getApplicationsStats() {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('status, archived');

    if (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return { success: false, error };
    }

    const activeApplications = data.filter(app => !app.archived);

    const stats = {
      total: activeApplications.length,
      active: activeApplications.length,
      archived: data.filter(app => app.archived).length,
      pending: activeApplications.filter(app => app.status === 'pending')
        .length,
      approved: activeApplications.filter(app => app.status === 'approved')
        .length,
      rejected: activeApplications.filter(app => app.status === 'rejected')
        .length,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return { success: false, error };
  }
}

/**
 * Submete o formulário de Triagem Inicial
 */
export async function submitScreeningForm(
  applicationId: string,
  formData: {
    question1: string;
    question2: string;
    question3: string;
    question4: string;
    question5: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({
        screening_data: formData,
        screening_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar triagem:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao salvar triagem:', error);
    throw error;
  }
}

/**
 * Submete o formulário de Entrevista Principal
 */
export async function submitInterviewForm(
  applicationId: string,
  formData: {
    currentlyEmployed: boolean;
    q1_1: string;
    q1_2: string;
    q1_3: string;
    q1_4: string;
    q1_5: string;
    q2_1: string;
    q2_2: string;
    q3_1: string;
    q3_2: string;
    q3_3: string;
    q3_4: string;
    q4_1: string;
    q4_2: string;
    q4_3: string;
    q6_1: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({
        interview_data: formData,
        interview_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar entrevista:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao salvar entrevista:', error);
    throw error;
  }
}

/**
 * Busca dados de triagem de um candidato
 */
export async function getScreeningForm(applicationId: string) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('screening_data, screening_completed_at')
      .eq('id', applicationId)
      .single();

    if (error) {
      console.error('Erro ao buscar triagem:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar triagem:', error);
    throw error;
  }
}

/**
 * Busca dados de entrevista de um candidato
 */
export async function getInterviewForm(applicationId: string) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('interview_data, interview_completed_at')
      .eq('id', applicationId)
      .single();

    if (error) {
      console.error('Erro ao buscar entrevista:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar entrevista:', error);
    throw error;
  }
}

