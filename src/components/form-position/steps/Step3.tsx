import { useState } from 'react';
import { ButtonGroup } from '../ButtonGroup';
import { TextField } from '../TextField';
import { TextAreaField } from '../TextAreaField';
import {
  formatCPF,
  formatDate,
  formatWhatsApp,
  formatSalary,
} from '../../../lib/formatters';
import {
  validateCPF,
  validateDate,
  validateEmail,
  validateWhatsApp,
  validateFullName,
  validateSalary,
} from '../../../lib/validators';
import type { ApplicationFormData } from '../../../types/application';

interface Step3Props {
  data: ApplicationFormData['step3'];
  onDataChange: (data: Partial<ApplicationFormData['step3']>) => void;
  onSubmit: () => void;
  onBack: () => void;
  showModal: (
    message: string,
    title?: string,
    type?: 'error' | 'success' | 'warning' | 'info'
  ) => void;
}

const estados = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

const availabilityOptions = [
  { value: 'imediata', label: 'Imediata' },
  { value: '15dias', label: '15 dias' },
  { value: '30dias', label: '30 dias' },
  { value: 'outro', label: 'Outro' },
];

export function Step3({
  data,
  onDataChange,
  onSubmit,
  onBack,
  showModal,
}: Step3Props) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(data.files || []);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        showModal(
          `O arquivo ${file.name} excede o tamanho máximo de 10MB.`,
          'Arquivo muito grande',
          'warning'
        );
        return false;
      }
      return true;
    });

    const newFiles = [...uploadedFiles, ...validFiles];
    setUploadedFiles(newFiles);
    onDataChange({ files: newFiles });
  };

  const handleRemoveFile = (fileName: string) => {
    const newFiles = uploadedFiles.filter(f => f.name !== fileName);
    setUploadedFiles(newFiles);
    onDataChange({ files: newFiles });
  };

  const handleSubmit = () => {
    const rules: Array<{
      field: string;
      elementId: string;
      isValid: boolean;
      message: string;
    }> = [
      {
        field: 'fullName',
        elementId: 'full-name',
        isValid: validateFullName(data.personalInfo.fullName),
        message: 'Por favor, informe seu nome completo (nome e sobrenome).',
      },
      {
        field: 'cpf',
        elementId: 'cpf',
        isValid: validateCPF(data.personalInfo.cpf),
        message: 'Por favor, informe um CPF válido com 11 dígitos.',
      },
      {
        field: 'birthDate',
        elementId: 'birth-date',
        isValid: validateDate(data.personalInfo.birthDate),
        message: 'Por favor, informe uma data válida no formato DD/MM/AAAA.',
      },
      {
        field: 'city',
        elementId: 'city',
        isValid: data.personalInfo.city.trim().length > 0,
        message: 'Por favor, informe sua cidade.',
      },
      {
        field: 'state',
        elementId: 'state',
        isValid: data.personalInfo.state.length > 0,
        message: 'Por favor, selecione seu estado.',
      },
      {
        field: 'email',
        elementId: 'email',
        isValid: validateEmail(data.contact.email),
        message: 'Por favor, informe um e-mail válido.',
      },
      {
        field: 'whatsapp',
        elementId: 'whatsapp',
        isValid: validateWhatsApp(data.contact.whatsapp),
        message: 'Por favor, informe um WhatsApp válido com DDD.',
      },
      {
        field: 'salaryExpectation',
        elementId: 'salary-expectation',
        isValid: validateSalary(data.salaryExpectation),
        message: 'Por favor, informe sua pretensão salarial.',
      },
      {
        field: 'availability',
        elementId: 'availability',
        isValid: data.availability.length > 0,
        message: 'Por favor, selecione sua disponibilidade para início.',
      },
    ];

    const failed = rules.find(rule => !rule.isValid);

    if (failed) {
      setErrors({ [failed.field]: true });
      showModal(failed.message, 'Campo obrigatório', 'warning');
      setTimeout(() => {
        document
          .getElementById(failed.elementId)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    setErrors({});
    onSubmit();
  };

  return (
    <div className="opacity-0 animate-[fadeInUp_0.5s_ease_forwards]">
      <div className="mb-8 pb-6 border-b-2 border-[#0a0e27]">
        <div className="font-['Space_Grotesk'] text-[13px] font-semibold tracking-[2px] text-[#3b82f6] mb-2 uppercase">
          Etapa Final
        </div>
        <h2 className="text-4xl font-bold text-[#0a0e27] mb-2">Seus Dados</h2>
      </div>

      {/* GitHub / Portfólio */}
      <div className="mb-8 p-7 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <h3 className="text-2xl font-bold text-[#0a0e27] mb-4">
          Mostre o que já construiu (opcional)
        </h3>
        <p className="mb-4 text-[#0a0e27]">
          Se tiver materiais que mostrem seu trabalho, manda aqui: prints de
          fluxos, links de projetos, screenshots, o que tiver.
        </p>

        <TextField
          id="github-link"
          value={data.githubLink}
          onChange={value => onDataChange({ githubLink: value })}
          label="Link do GitHub ou portfólio (opcional)"
          placeholder="https://github.com/seu-usuario"
        />
      </div>

      {/* Upload de arquivos */}
      <div
        className="border-2 border-dashed border-[#e0e7ef] rounded p-12 text-center bg-white transition-all cursor-pointer my-8 hover:border-[#3b82f6] hover:bg-[#eff6ff]"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <div className="text-5xl mb-4 text-[#3b82f6]">📎</div>
        <p className="font-semibold mb-2 text-[#0a0e27]">
          Clique para fazer upload
        </p>
        <p className="text-[#78909c] text-base">
          PDF, imagens, ZIP (máx. 10MB cada)
        </p>
        <input
          type="file"
          id="fileInput"
          multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-5 mb-8">
          <p className="text-sm text-[#546e7a] mb-3">
            📎 {uploadedFiles.length} arquivo(s) selecionado(s).
          </p>
          {uploadedFiles.map(file => (
            <div
              key={file.name}
              className="flex items-center justify-between p-3 bg-[#eff6ff] rounded mb-2"
            >
              <span className="font-['Space_Grotesk'] text-sm text-[#0a0e27]">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
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

      {/* Dados Pessoais */}
      <div className="mt-12 mb-8 p-6 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <h3 className="text-[22px] font-bold text-[#0a0e27] mb-5">
          Dados Pessoais
        </h3>

        <TextField
          id="full-name"
          value={data.personalInfo.fullName}
          onChange={value =>
            onDataChange({
              personalInfo: { ...data.personalInfo, fullName: value },
            })
          }
          label="Nome Completo"
          placeholder="Seu nome completo"
          required
          error={errors.fullName}
        />

        <TextField
          id="cpf"
          value={data.personalInfo.cpf}
          onChange={value =>
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
          onChange={value =>
            onDataChange({
              personalInfo: { ...data.personalInfo, birthDate: value },
            })
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
              onChange={value =>
                onDataChange({
                  personalInfo: { ...data.personalInfo, city: value },
                })
              }
              label="Cidade"
              placeholder="Sua cidade"
              required
              error={errors.city}
            />
          </div>
          <div className="my-8">
            <label
              htmlFor="state"
              className="block font-semibold mb-3 text-[#0a0e27] text-lg"
            >
              <span className="text-[#3b82f6] font-bold">* </span>Estado
            </label>
            <select
              id="state"
              value={data.personalInfo.state}
              onChange={e =>
                onDataChange({
                  personalInfo: { ...data.personalInfo, state: e.target.value },
                })
              }
              className={`w-full p-4 border-2 ${
                errors.state ? 'border-red-600' : 'border-[#e0e7ef]'
              } rounded font-['Space_Grotesk'] text-[17px] text-[#0a0e27] transition-all bg-white focus:outline-none focus:border-[#3b82f6] cursor-pointer`}
            >
              <option value="">UF</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="mb-8 p-6 bg-linear-to-br from-[#f8f9fa] to-white border-l-4 border-[#3b82f6] rounded-r">
        <h3 className="text-[22px] font-bold text-[#0a0e27] mb-5">Contato</h3>

        <TextField
          id="email"
          type="email"
          value={data.contact.email}
          onChange={value =>
            onDataChange({ contact: { ...data.contact, email: value } })
          }
          label="E-mail"
          placeholder="seu.email@exemplo.com"
          required
          error={errors.email}
        />

        <TextField
          id="whatsapp"
          type="tel"
          value={data.contact.whatsapp}
          onChange={value =>
            onDataChange({ contact: { ...data.contact, whatsapp: value } })
          }
          label="WhatsApp"
          placeholder="(00) 00000-0000"
          required
          formatter={formatWhatsApp}
          error={errors.whatsapp}
        />
      </div>

      {/* Pretensão e disponibilidade */}
      <TextField
        id="salary-expectation"
        value={data.salaryExpectation}
        onChange={value => onDataChange({ salaryExpectation: value })}
        label="Pretensão Salarial"
        placeholder="R$ 0.000,00"
        required
        formatter={formatSalary}
        error={errors.salaryExpectation}
      />

      <div className="my-8">
        <label
          htmlFor="availability"
          className="block font-semibold mb-3 text-[#0a0e27] text-lg"
        >
          <span className="text-[#3b82f6] font-bold">* </span>Disponibilidade
          para início
        </label>
        <select
          id="availability"
          value={data.availability}
          onChange={e => onDataChange({ availability: e.target.value })}
          className={`w-full p-4 border-2 ${
            errors.availability ? 'border-red-600' : 'border-[#e0e7ef]'
          } rounded font-['Space_Grotesk'] text-[17px] text-[#0a0e27] transition-all bg-white focus:outline-none focus:border-[#3b82f6] cursor-pointer`}
        >
          <option value="">Selecione</option>
          {availabilityOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-12">
        <TextAreaField
          id="final-notes"
          value={data.finalNotes}
          onChange={value => onDataChange({ finalNotes: value })}
          label="Quer contar mais alguma coisa que não foi perguntado?"
          placeholder="Opcional. Fique à vontade."
        />
      </div>

      <ButtonGroup
        onBack={onBack}
        onNext={handleSubmit}
        nextLabel="Enviar Aplicação"
      />
    </div>
  );
}
