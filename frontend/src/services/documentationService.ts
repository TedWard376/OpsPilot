/**
 * Documentation access layer.
 *
 * Pages and components call these functions, never `data/documentation.ts`
 * directly. `getAllDocs`/`getDocById` become `GET /api/docs` and
 * `GET /api/docs/{id}`; `getDocDetail` becomes `GET /api/docs/{id}/detail`.
 * Until then, everything is derived from the in-memory `docsData` array.
 */

import type { DocDetailBundle, DocItem, RelatedAlertRef, RelatedDocRef, RelatedIncidentRef, RelatedServerRef } from '../types/documentation'
import { DOC_SECTIONS, docsData } from '../data/documentation'
import { getAllServers } from './serverService'
import { getAllAlerts } from './alertService'
import { getAllIncidents } from './incidentService'
import { hashCode, pick } from '../utils/mockDataGenerators'

export function getAllDocs(): DocItem[] {
  return docsData
}

export function getDocById(id: string): DocItem | undefined {
  return docsData.find((doc) => doc.id === id)
}

export function getDocCategories(): DocItem['category'][] {
  return Array.from(new Set(docsData.map((doc) => doc.category))).sort()
}

export function getDocTags(): string[] {
  return Array.from(new Set(docsData.flatMap((doc) => doc.tags))).sort()
}

/**
 * Builds a doc's detail-page bundle: its content sections plus
 * deterministically-sampled cross-links into real servers, alerts, and
 * incidents. Seeded from the doc id so the same doc always links to the
 * same items across reloads.
 */
export function getDocDetail(doc: DocItem): DocDetailBundle {
  const seed = hashCode(doc.id)
  const allServers = getAllServers()
  const allAlerts = getAllAlerts()
  const allIncidents = getAllIncidents()
  const otherDocs = docsData.filter((candidate) => candidate.id !== doc.id)

  const relatedServers: RelatedServerRef[] = allServers.length
    ? [pick(allServers, seed), pick(allServers, seed + 1)]
        .filter((server, index, list) => list.findIndex((s) => s.id === server.id) === index)
        .map((server) => ({ id: server.id, hostname: server.hostname, status: server.status }))
    : []

  const relatedAlerts: RelatedAlertRef[] = allAlerts.length
    ? [pick(allAlerts, seed + 2)].map((alert) => ({ id: alert.id, name: alert.name, severity: alert.severity }))
    : []

  const relatedIncidents: RelatedIncidentRef[] = allIncidents.length
    ? [pick(allIncidents, seed + 3)].map((incident) => ({
        id: incident.id,
        title: incident.title,
        priority: incident.priority,
        status: incident.status,
      }))
    : []

  const relatedDocs: RelatedDocRef[] = otherDocs.length
    ? [pick(otherDocs, seed + 4), pick(otherDocs, seed + 5)]
        .filter((related, index, list) => list.findIndex((d) => d.id === related.id) === index)
        .map((related) => ({ title: related.title, type: related.type, description: related.description }))
    : []

  return {
    sections: DOC_SECTIONS[doc.id] ?? [],
    relatedServers,
    relatedAlerts,
    relatedIncidents,
    relatedDocs,
    aiAssistant: {
      summary: `Ask the AI Assistant to walk through "${doc.title}" for a specific server, or to summarize what changed since it was last updated.`,
      suggestedPrompts: [
        `Summarize this ${doc.type.toLowerCase()} in three steps`,
        `Which of my servers are most likely to need this?`,
        `Has anything in this doc gone out of date?`,
      ],
    },
  }
}
