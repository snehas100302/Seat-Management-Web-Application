package com.sneha.seatmgmtapp.service.impl;

import com.sneha.seatmgmtapp.dto.request.DocumentChecklistRequest;
import com.sneha.seatmgmtapp.dto.response.DocumentChecklistResponse;
import com.sneha.seatmgmtapp.entity.Applicant;
import com.sneha.seatmgmtapp.entity.DocumentChecklist;
import com.sneha.seatmgmtapp.enums.DocumentStatus;
import com.sneha.seatmgmtapp.exception.ResourceNotFoundException;
import com.sneha.seatmgmtapp.repository.ApplicantRepository;
import com.sneha.seatmgmtapp.repository.DocumentChecklistRepository;
import com.sneha.seatmgmtapp.service.DocumentChecklistService;
import com.sneha.seatmgmtapp.utils.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DocumentChecklistServiceImpl implements DocumentChecklistService {

    private final DocumentChecklistRepository documentChecklistRepository;
    private final ApplicantRepository applicantRepository;

    @Override
    public DocumentChecklistResponse create(DocumentChecklistRequest request) {
        Applicant applicant = applicantRepository.findById(request.getApplicantId())
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", request.getApplicantId()));

        DocumentChecklist document = DocumentChecklist.builder()
                .documentName(request.getDocumentName())
                .status(request.getStatus() != null ? request.getStatus() : DocumentStatus.PENDING)
                .remarks(request.getRemarks())
                .applicant(applicant)
                .build();
        document = documentChecklistRepository.save(document);
        log.info("Created document checklist '{}' for applicant: {}", document.getDocumentName(), applicant.getName());
        return EntityMapper.toDocumentChecklistResponse(document);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentChecklistResponse getById(Long id) {
        DocumentChecklist document = documentChecklistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DocumentChecklist", "id", id));
        return EntityMapper.toDocumentChecklistResponse(document);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentChecklistResponse> getByApplicantId(Long applicantId) {
        return documentChecklistRepository.findByApplicantId(applicantId).stream()
                .map(EntityMapper::toDocumentChecklistResponse).toList();
    }

    @Override
    public DocumentChecklistResponse updateStatus(Long id, DocumentStatus status) {
        DocumentChecklist document = documentChecklistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DocumentChecklist", "id", id));
        document.setStatus(status);
        document = documentChecklistRepository.save(document);
        log.info("Updated document '{}' status to {} for applicant: {}",
                document.getDocumentName(), status, document.getApplicant().getName());
        return EntityMapper.toDocumentChecklistResponse(document);
    }

    @Override
    public void delete(Long id) {
        DocumentChecklist document = documentChecklistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("DocumentChecklist", "id", id));
        documentChecklistRepository.delete(document);
        log.info("Deleted document checklist: {}", document.getDocumentName());
    }
}

