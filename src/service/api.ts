import { supabase, supabasePublic } from '../lib/supabase';
import type { ApplicationFormData } from '../types/application';

/**
 * Transforma os dados do formulário para o formato do banco de dados
 */
function transformFormDataToDatabase(formData: ApplicationFormData) {
  return {
    // Step 0
    step0_accepted: formData.step0.accepted,

    // Step 1
    step1_accepted: formData.step1.accepted,
    step1_mission_reflection: formData.step1.missionReflection,

    // Step 2 - Outcomes
    outcome21_playbook_accepted: formData.step2.outcomes.playbook.accepted,
    outcome21_playbook_comment: formData.step2.outcomes.playbook.comment,

    outcome22_team_restructure_accepted:
      formData.step2.outcomes.teamRestructure.accepted,
    outcome22_team_restructure_comment:
      formData.step2.outcomes.teamRestructure.comment,

    outcome23_operational_discipline_accepted:
      formData.step2.outcomes.operationalDiscipline.accepted,
    outcome23_operational_discipline_comment:
      formData.step2.outcomes.operationalDiscipline.comment,

    outcome24_high_performance_accepted:
      formData.step2.outcomes.highPerformance.accepted,
    outcome24_high_performance_comment:
      formData.step2.outcomes.highPerformance.comment,

    outcome241_bar_raiser_accepted: formData.step2.outcomes.barRaiser.accepted,
    outcome241_bar_raiser_comment: formData.step2.outcomes.barRaiser.comment,

    outcome242_accountability_accepted:
      formData.step2.outcomes.accountability.accepted,
    outcome242_accountability_comment:
      formData.step2.outcomes.accountability.comment,

    outcome26_conversion_accepted: formData.step2.outcomes.conversion.accepted,
    outcome26_conversion_comment: formData.step2.outcomes.conversion.comment,

    outcome27_ai_accepted: formData.step2.outcomes.ai.accepted,
    outcome27_ai_comment: formData.step2.outcomes.ai.comment,

    // Step 3 - Competências (como JSON)
    competencies: formData.step3.competencies,

    // Step 4 - Informações Pessoais
    full_name: formData.step4.personalInfo.fullName,
    cpf: formData.step4.personalInfo.cpf,
    birth_date: formData.step4.personalInfo.birthDate,
    city: formData.step4.personalInfo.city,
    state: formData.step4.personalInfo.state,

    // Step 4 - Contato
    email: formData.step4.contact.email,
    whatsapp: formData.step4.contact.whatsapp,

    // Step 4 - Redes Sociais
    social_media: formData.step4.socialMedia.length > 0 ? formData.step4.socialMedia : null,

    // Step 4 - Finalização
    salary_expectation: formData.step4.salaryExpectation,
    final_notes: formData.step4.finalNotes,
    documents: formData.step4.files.map((file: File) => file.name), // Por enquanto apenas os nomes

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
    // 1. Inserir a aplicação no banco (o ID será gerado automaticamente pelo banco)
    const dbData = transformFormDataToDatabase(formData);
    
    console.log('🔍 Verificando cliente Supabase:', {
      url: import.meta.env.VITE_SUPABASE_URL,
      keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length,
      usingPublicClient: true
    });

    // Usar cliente público (sem autenticação) para inserção
    const { data: applicationData, error: dbError } = await supabasePublic
      .from('applications')
      .insert([dbData])
      .select()
      .single();
    
    console.log('📡 Resposta do Supabase:', { data: applicationData, error: dbError });

    if (dbError) {
      return { success: false, error: dbError };
    }

    const applicationId = applicationData.id;
    let photoUrl: string | null = null;

    // 2. Upload da foto (se existir)
    if (formData.step4.photo) {
      const photoFile = formData.step4.photo;
      const photoExt = photoFile.name.split('.').pop();
      const photoPath = `${applicationId}/photo/${Date.now()}.${photoExt}`;

      const { error: photoError } = await supabase.storage
        .from('files-sales-manager')
        .upload(photoPath, photoFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (photoError) {
        console.error('❌ Erro no upload da foto:', photoError);
      } else {
        photoUrl = photoPath;
      }
    }

    // 3. Se houver arquivos, fazer upload
    if (formData.step4.files && formData.step4.files.length > 0) {
      const uploadResult = await uploadDocuments(
        formData.step4.files,
        applicationId
      );

      if (!uploadResult.success) {
        console.error('Erro ao fazer upload de arquivos:', uploadResult.error);
        // Aplicação foi criada, mas arquivos falharam
        return {
          success: true,
          data: applicationData,
          error: {
            message: 'Aplicação criada, mas erro ao enviar arquivos',
            uploadError: uploadResult.error,
          },
        };
      }

      // 4. Atualizar a aplicação com os caminhos dos arquivos e foto
      const updateData: { documents: string[]; photo_url?: string } = {
        documents: uploadResult.urls || [],
      };
      if (photoUrl) {
        updateData.photo_url = photoUrl;
      }

      const { error: updateError } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', applicationId);

      if (updateError) {
        console.error('Erro ao atualizar documentos:', updateError);
      } else {
        console.error('Documentos atualizados com sucesso');
      }
    }

    return { success: true, data: applicationData };
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
      total: data.length,
      active: activeApplications.length,
      archived: data.filter(app => app.archived).length,
      pending: activeApplications.filter(app => app.status === 'pending').length,
      approved: activeApplications.filter(app => app.status === 'approved').length,
      rejected: activeApplications.filter(app => app.status === 'rejected').length,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return { success: false, error };
  }
}
