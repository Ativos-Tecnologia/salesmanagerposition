import { useState } from 'react';
import { ButtonGroup } from '../ButtonGroup';
import { TextField } from '../TextField';
import { TextAreaField } from '../TextAreaField';
import { formatCPF, formatDate, formatWhatsApp, formatSalary } from '../../../lib/formatters';
import {
  validateCPF,
  validateDate,
  validateEmail,
  validateWhatsApp,
  validateFullName,
  validateSalary,
} from '../../../lib/validators';
import type { ApplicationFormData } from '../../../types/application';

interface Step4Props {
  data: ApplicationFormData['step4'];
  onDataChange: (data: Partial<ApplicationFormData['step4']>) => void;
  onSubmit: () => void;
  onBack: () => void;
  showModal: (message: string, title?: string, type?: 'error' | 'success' | 'warning' | 'info') => void;
}

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export function Step4({ data, onDataChange, onSubmit, onBack, showModal }: Step4Props) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(data.files || []);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        showModal(`O arquivo ${file.name} excede o tamanho máximo de 10MB.`, 'Arquivo muito grande', 'warning');
        return false;
      }
      return true;
    });

    const newFiles = [...uploadedFiles, ...validFiles];
    setUploadedFiles(newFiles);
    onDataChange({ files: newFiles });
  };

  const handleRemoveFile = (fileName: string) => {
    const newFiles = uploadedFiles.filter((f) => f.name !== fileName);
    setUploadedFiles(newFiles);
    onDataChange({ files: newFiles });
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: boolean } = {};

    if (!validateFullName(data.personalInfo.fullName)) {
      showModal('Por favor, informe seu nome completo (nome e sobrenome).', 'Atenção', 'warning');
      newErrors.fullName = true;
      setErrors(newErrors);
      return;
    }

    if (!validateCPF(data.personalInfo.cpf)) {
      showModal('Por favor, informe um CPF válido (11 dígitos).', 'Atenção', 'warning');
      newErrors.cpf = true;
      setErrors(newErrors);
      return;
    }

    if (!validateDate(data.personalInfo.birthDate)) {
      showModal('Por favor, informe uma data de nascimento válida (DD/MM/AAAA).', 'Atenção', 'warning');
      newErrors.birthDate = true;
      setErrors(newErrors);
      return;
    }

    if (!data.personalInfo.city.trim()) {
      showModal('Por favor, informe sua cidade.', 'Atenção', 'warning');
      newErrors.city = true;
      setErrors(newErrors);
      return;
    }

    if (!data.personalInfo.state) {
      showModal('Por favor, selecione seu estado.', 'Atenção', 'warning');
      newErrors.state = true;
      setErrors(newErrors);
      return;
    }

    if (!validateEmail(data.contact.email)) {
      showModal('Por favor, informe um e-mail válido.', 'Atenção', 'warning');
      newErrors.email = true;
      setErrors(newErrors);
      return;
    }

    if (!validateWhatsApp(data.contact.whatsapp)) {
      showModal('Por favor, informe um WhatsApp válido com DDD.', 'Atenção', 'warning');
      newErrors.whatsapp = true;
      setErrors(newErrors);
      return;
    }

    if (!validateSalary(data.salaryExpectation)) {
      showModal('Por favor, informe sua pretensão salarial.', 'Atenção', 'warning');
      newErrors.salaryExpectation = true;
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit();
  };

  return (
    <div className="opacity-0 animate-[fadeInUp_0.5s_ease_forwards]">
      <div className="mb-8 pb-6 border-b-2 border-[#0a0e27]">
        <div className="font-['Space_Grotesk'] text-[13px] font-semibold tracking-[2px] text-[#00e676] mb-2 uppercase">
          Etapa Final
        </div>
        <h2 className="text-4xl font-bold text-[#0a0e27] mb-2">Evidências e Conclusão</h2>
      </div>

      <div className="mb-8 p-7 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#00e676] rounded-r">
        <h3 className="text-2xl font-bold text-[#0a0e27] mb-4">Materiais de Suporte (Opcional)</h3>
        <p className="mb-2 text-[#0a0e27]">
          Se você possui materiais que demonstrem sua capacidade, compartilhe aqui.
        </p>
      </div>

      <div
        className="border-2 border-dashed border-[#e0e7ef] rounded p-12 text-center bg-white transition-all cursor-pointer my-8 hover:border-[#00e676] hover:bg-[#f8fdf9]"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <div className="text-5xl mb-4 text-[#00e676]">📎</div>
        <p className="font-semibold mb-2 text-[#0a0e27]">Clique para fazer upload de arquivos</p>
        <p className="text-[#78909c] text-base">
          PDF, DOCX, XLSX, PPT, PNG, JPG (máx. 10MB cada)
        </p>
        <input
          type="file"
          id="fileInput"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-5">
          {uploadedFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between p-3 bg-[#f1f8f4] rounded mb-2"
            >
              <span className="font-['Space_Grotesk'] text-sm text-[#0a0e27]">{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(file.name)}
                className="bg-transparent border-none text-[#78909c] cursor-pointer text-xl px-2 transition-colors hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 mb-8 p-6 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#00e676] rounded-r">
        <h3 className="text-[22px] font-bold text-[#0a0e27] mb-5">Dados Pessoais</h3>

        <TextField
          id="full-name"
          value={data.personalInfo.fullName}
          onChange={(value) =>
            onDataChange({ personalInfo: { ...data.personalInfo, fullName: value } })
          }
          label="Nome Completo"
          placeholder="Seu nome completo"
          required
          error={errors.fullName}
        />

        <TextField
          id="cpf"
          value={data.personalInfo.cpf}
          onChange={(value) =>
            onDataChange({ personalInfo: { ...data.personalInfo, cpf: value } })
          }
          label="CPF"
          placeholder="000.000.000-00"
          required
          formatter={formatCPF}
          error={errors.cpf}
        />

        <TextField
          id="birth-date"
          value={data.personalInfo.birthDate}
          onChange={(value) =>
            onDataChange({ personalInfo: { ...data.personalInfo, birthDate: value } })
          }
          label="Data de Nascimento"
          placeholder="DD/MM/AAAA"
          required
          formatter={formatDate}
          error={errors.birthDate}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <TextField
              id="city"
              value={data.personalInfo.city}
              onChange={(value) =>
                onDataChange({ personalInfo: { ...data.personalInfo, city: value } })
              }
              label="Cidade"
              placeholder="Sua cidade"
              required
              error={errors.city}
            />
          </div>

          <div className="my-8">
            <label htmlFor="state" className="block font-semibold mb-3 text-[#0a0e27] text-lg">
              <span className="text-[#00e676] font-bold">* </span>
              Estado
            </label>
            <select
              id="state"
              value={data.personalInfo.state}
              onChange={(e) =>
                onDataChange({ personalInfo: { ...data.personalInfo, state: e.target.value } })
              }
              className={`w-full p-4 border-2 ${
                errors.state ? 'border-red-600' : 'border-[#e0e7ef]'
              } rounded font-['Space_Grotesk'] text-[17px] text-[#0a0e27] transition-all bg-white focus:outline-none focus:border-[#00e676] cursor-pointer`}
            >
              <option value="">UF</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-8 p-6 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#00e676] rounded-r">
        <h3 className="text-[22px] font-bold text-[#0a0e27] mb-5">Dados de Contato</h3>

        <TextField
          id="email"
          type="email"
          value={data.contact.email}
          onChange={(value) => onDataChange({ contact: { ...data.contact, email: value } })}
          label="E-mail"
          placeholder="seu.email@exemplo.com"
          required
          error={errors.email}
        />

        <TextField
          id="whatsapp"
          type="tel"
          value={data.contact.whatsapp}
          onChange={(value) => onDataChange({ contact: { ...data.contact, whatsapp: value } })}
          label="WhatsApp"
          placeholder="(00) 00000-0000"
          required
          formatter={formatWhatsApp}
          error={errors.whatsapp}
        />
      </div>

      <TextField
        id="salary-expectation"
        value={data.salaryExpectation}
        onChange={(value) => onDataChange({ salaryExpectation: value })}
        label="Pretensão Salarial"
        placeholder="R$ 0.000,00"
        required
        formatter={formatSalary}
        error={errors.salaryExpectation}
      />

      <div className="mt-12">
        <TextAreaField
          id="final-notes"
          value={data.finalNotes}
          onChange={(value) => onDataChange({ finalNotes: value })}
          label="Existe algo relevante sobre sua trajetória que não foi perguntado?"
          placeholder="Compartilhe aqui qualquer informação adicional..."
        />
      </div>

      <ButtonGroup
        onBack={onBack}
        onNext={handleSubmit}
        nextLabel="Concluir Aplicação"
      />
    </div>
  );
}

